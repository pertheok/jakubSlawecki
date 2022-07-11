<?php

    ini_set('display_errors', 1);

    include("config.php");
    require './phpMailer/src/Exception.php';
    require './phpMailer/src/PHPMailer.php';
    require './phpMailer/src/SMTP.php';

    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;
    use PHPMailer\PHPMailer\SMTP;

    $mail = new PHPMailer;

    $mail->isSMTP();                                          
    $mail->Host       = 'smtp.titan.email'; 
    $mail->SMTPAuth   = true;                                 
    $mail->Username   = $myAutoEmail;               
    $mail->Password   = $myAutoEmailPassword;                           
    $mail->SMTPSecure = 'ssl';                                  
    $mail->Port       = 465;                                  

    //Recipients
    $mail->setFrom($myAutoEmail, 'Mailer');
    $mail->addAddress($myPersonalEmail);
    $mail->addReplyTo($_POST['email'], $_POST['name']);

    // Content
    $mail->isHTML(true);                                 
    $mail->Subject = 'Someone sent you a message from your portfolio webpage!';
    $mail->Body = $_POST['message'];

    $mail->send();
    
?>