<?php

    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;

    $myAutoEmail = "contact@jakubslawecki.com";
    $myAutoEmailPassword = "4t1vcGtAY0";
    $myPersonalEmail = "kubaslawecki@gmail.com;

    require './phpMailer/src/Exception.php';
    require './phpMailer/src/PHPMailer.php';
    require './phpMailer/src/SMTP.php';

    if(isset($_POST['submit'])) {

        $mail = new PHPMailer(true);

        $mail->SMTPDebug = 0;

        $mail->Host = 'smtp.hostinger.com';
        $mail->SMTPAuth = true;
        $mail->Username = $myAutoEmail;
        $mail->Password = $myAutoEmailPassword;
        $mail->SMTPSecure = 'SSL/TLS';
        $mail->Port = 465;

        $mail->setFrom($myAutoEmail, 'Mailer');
        $mail->addAddress($myPersonalEmail);
        $mail->addReplyTo($_POST['email'], $_POST['name']);

        $mail->isHTML(true);
        $mail->Body = $_POST['message'];

        try {
            $mail->send();
            echo 'Your message was sent successfully!';
        } catch (Exception $e) {
            echo "Your message could not be sent! PHPMailer Error: {$mail->ErrorInfo}";
        }
        
    } else {
        echo "There is a problem with the contact.html document!";
    }
    
?>