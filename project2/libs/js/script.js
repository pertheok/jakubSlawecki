//arrays that will be used to populate dropdowns used in creating or editing personnel or departments
let departments = [];
let locations = [];

//functions for populating these arrays

const getAllLocations = () => {
    $.ajax({
        url: "libs/php/readAllLocations.php",
        type: "POST",
        dataType: 'json',
        success: function(result) {

            if (result.status.name == "ok") {

                locations = [];
                //populate the locations array and sort it alphabetically by names
                for (let i = 0; i < result.data.length; i++) {
                    locations[i] = {id: parseInt(result.data[i].id), name: result.data[i].name};
                }

                locations.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`${jqXHR}, ${textStatus}, ${errorThrown}`);
        }
    });
};

const getAllDepartments = () => {

    $.ajax({
        url: "libs/php/readAllDepartments.php",
        type: "POST",
        dataType: 'json',
        async: false,
        success: function(result) {

            if (result.status.name == "ok") {

                departments = [];
                //populate the departments array and sort it by names alphabetically
                for (let i = 0; i < result.data.length; i++) {
                    departments[i] = {id: parseInt(result.data[i].id), name: result.data[i].name};
                }

                departments.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`${jqXHR}, ${textStatus}, ${errorThrown}`);
        }
    });
}

//call the functions to populate these arrays

getAllLocations();
getAllDepartments();


//functions for populating the main table

//populate the table with basic personnel info
const readAllPersonnel = () => {

    //append the options to the department selection when 
    $("#departmentID").html("");
    for (let i = 0; i < departments.length; i++) {
        $("#departmentID").append(`<option value="${departments[i].id}">${departments[i].name}</option>`);
    }

    $.ajax({
        url: "libs/php/readAllPersonnel.php",
        type: "POST",
        dataType: 'json',
        success: function(result) {

            if (result.status.name == "ok") {

                //clear the results table
                $("#tableData").html("");

                //set the button description
                $("#addNewButtonText").html(`Add a new Employee`);

                //set the table body with the requested info - certain columns are displayed only on certain display sizes to prevent overflowing
                for (let i = 0;  i < result.data.length; i++) {
                    $("#tableData").append(
                        `<tr>
                            <td>
                                ${result.data[i].lastName}
                            </td>
                            <td class="d-none d-md-table-cell">
                                ${result.data[i].firstName}
                            </td>
                            <td class="d-none d-lg-table-cell">
                                ${result.data[i].jobTitle ? result.data[i].jobTitle : ''}
                            </td>
                            <td class="d-none d-md-table-cell">
                                ${result.data[i].email}
                            </td>
                            <td>
                                ${result.data[i].department}
                            </td>
                            <td class="d-none d-md-table-cell">
                                ${result.data[i].location}
                            </td>
                            <td>
                                <span class="m-1 fa fa-eye" onclick="readPersonnelByID(${result.data[i].id});">
                                </span>
                                <span class="m-1 fa fa-pencil" onclick="editPersonnelModal(${result.data[i].id});">
                                </span>
                                <span class="m-1 fa fa-trash" onclick="deletePersonnelModal(${result.data[i].id});">
                                </span>
                            </td>
                        </tr>`
                    );
                }
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`${jqXHR}, ${textStatus}, ${errorThrown}`);
        }
    });

    $('#addNewPersonnel').show();
    $('#addNewDepartment').hide();
    $('#addNewLocation').hide();
};

//populate the table with department info
const readAllDepartments = () => {

    //append the options to the location selection when creating
    $("#locationID").html("");
    for (let i = 0; i < locations.length; i++) {
            $("#locationID").append(`<option value="${locations[i].id}">${locations[i].name}</option>`);
    }

    $.ajax({
        url: "libs/php/readAllDepartments.php",
        type: "POST",
        dataType: 'json',
        async: false,
        success: function(result) {

            if (result.status.name == "ok") {

                //clear the results table and the "Add New" button
                $("#tableData").html("");

                //set the table body with the requested info
                for (let i = 0;  i < result.data.length; i++) {
                    $("#tableData").append(
                        `<tr>
                            <td>
                                ${result.data[i].name}
                            </td>
                            <td>
                                ${result.data[i].location}
                            </td>
                            <td>
                                <span class="m-1 fa fa-eye" onclick="readDepartmentByID(${result.data[i].id});">
                                </span>
                                <span class="m-1 fa fa-pencil" onclick="editDepartmentModal(${result.data[i].id});">
                                </span>
                                <span class="m-1 fa fa-trash" onclick="deleteDepartmentModal(${result.data[i].id});">
                                </span>
                            </td>
                        </tr>`
                    );
                }
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`${jqXHR}, ${textStatus}, ${errorThrown}`);
        }
    });

    $('#addNewPersonnel').hide();
    $('#addNewDepartment').show();
    $('#addNewLocation').hide();
};

//populate the table with location info
const readAllLocations = () => {

    $.ajax({
        url: "libs/php/readAllLocations.php",
        type: "POST",
        dataType: 'json',
        success: function(result) {

            if (result.status.name == "ok") {

                //clear the results table
                $("#tableData").html("");

                //set the table body with the requested info
                for (let i = 0;  i < result.data.length; i++) {
                    $("#tableData").append(
                        `<tr>
                            <td>
                                ${result.data[i].name}
                            </td>
                            <td>
                                <span class="m-1 fa fa-eye" onclick="readLocationByID(${result.data[i].id});">
                                </span>
                                <span class="m-1 fa fa-pencil" onclick="editLocationModal(${result.data[i].id});">
                                </span>
                                <span class="m-1 fa fa-trash" onclick="deleteLocationModal(${result.data[i].id});">
                                </span>
                            </td>
                        </tr>`
                    );
                }
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`${jqXHR}, ${textStatus}, ${errorThrown}`);
        }
    });

    $('#addNewPersonnel').hide();
    $('#addNewDepartment').hide();
    $('#addNewLocation').show();
};

//Create functions

const createPersonnel = () => {

    $.ajax({
        url: "libs/php/createPersonnel.php",
        type: "POST",
        dataType: 'json',
        data: {
            firstName: $("#firstName").val(),
            lastName: $("#lastName").val(),
            jobTitle: $("#jobTitle").val(),
            email: $("#email").val(),
            departmentID: $("#departmentID").val()
        },
        success: function(result) {

            if (result.status.name == "ok") {
                $("#createPersonnelModal").modal("hide");
                readAllPersonnel();
            }                
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`${jqXHR}, ${textStatus}, ${errorThrown}`);
        }
    });

};

const createDepartment = () => {

    $.ajax({
        url: "libs/php/createDepartment.php",
        type: "POST",
        dataType: 'json',
        data: {
            name: $("#departmentName").val(),
            locationID: $("#locationID").val()
        },
        success: function(result) {

            if (result.status.name == "ok") {

                // call the function used to populate the departments array
                getAllDepartments();
                $("#createDepartmentModal").modal("hide");
                readAllDepartments();
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`${jqXHR}, ${textStatus}, ${errorThrown}`);
        }  
    });
};

const createLocation = () => {
    $.ajax({
        url: "libs/php/createLocation.php",
        type: "POST",
        dataType: 'json',
        data: {
            name: $("#locationName").val()
        },
        success: function(result) {

            if (result.status.name == "ok") {
                
                // call the function used to populate the locations array
                getAllLocations();
                $("#createLocationModal").modal("hide");
                readAllLocations();
            }
            
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`${jqXHR}, ${textStatus}, ${errorThrown}`);
        }
    });

};

//Read functions

const readPersonnelByID = id => {

    $.ajax({
        url: "libs/php/readPersonnelByID.php",
        type: "POST",
        dataType: 'json',
        data: {
            id: id
        },
        success: function(result) {

            if (result.status.name == "ok") {

                //set the read modal content
                $("#personnelLastName").html(`${result.data.personnel[0].lastName}`);
                $("#personnelFirstName").html(`${result.data.personnel[0].firstName}`);
                $("#personnelJobTitle").html(`${result.data.personnel[0].jobTitle ? result.data.personnel[0].jobTitle : ''}`);
                $("#personnelEmail").html(`${result.data.personnel[0].email}`);
                $("#personnelDepartment").html(`${result.data.personnel[0].department}`);
                $("#personnelLocation").html(`${result.data.personnel[0].location}`);

                //display the read modal
                $("#viewPersonnelModal").modal("show");
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`${jqXHR}, ${textStatus}, ${errorThrown}`);
        }
    });
};

const readDepartmentByID = id => {

    $.ajax({
        url: "libs/php/readDepartmentByID.php",
        type: "POST",
        dataType: 'json',
        data: {
            id: id
        },
        success: function(result) {

            if (result.status.name == "ok") {

                //set read modal content
                $("#deptName").html(`${result.data[0].name}`);
                $("#departmentLocation").html(`${result.data[0].location}`);

                //display the read modal
                $("#viewDepartmentModal").modal("show");
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`${jqXHR}, ${textStatus}, ${errorThrown}`);
        }
    });

};

const readLocationByID = id => {

    $.ajax({
        url: "libs/php/readLocationByID.php",
        type: "POST",
        dataType: 'json',
        data: {
            id: id
        },
        success: function(result) {

            if (result.status.name == "ok") {

                //set read modal content
                $("#location").html(`${result.data[0].name}`);

                //display the read modal
                $("#viewLocationModal").modal("show");
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`${jqXHR}, ${textStatus}, ${errorThrown}`);
        }
    });

};

//Update functions

// values used to hold ID of the record currently being edited, used for submitting the edit request

let personnelIDtoEdit;
let departmentIDtoEdit;
let locationIDtoEdit;

//helper functions to set the edit modal
const editPersonnelModal = id => {

    $.ajax({
        url: "libs/php/readPersonnelByID.php",
        type: "POST",
        dataType: 'json',
        data: {
            id: id
        },
        async: false,
        success: function(result) {

            if (result.status.name == "ok") {

                personnelIDtoEdit = result.data.personnel[0].id;

                //set edit modal content
                $("#newFirstName").attr("value", `${result.data.personnel[0].firstName}`);
                $("#newLastName").attr("value", `${result.data.personnel[0].lastName}`);
                $("#newJobTitle").attr("value", `${result.data.personnel[0].jobTitle ? result.data.personnel[0].jobTitle : ''}`);
                $("#newEmail").attr("value", `${result.data.personnel[0].email}`);
                $("#newDepartment").html("");
                
                //append the options to the department selection when editing
                for (let i = 0; i < departments.length; i++) {

                    //pre-selects the current department in the edit window
                    if (departments[i].id === result.data.personnel[0].departmentID) {
                        $("#newDepartment").append(`<option value="${departments[i].id}" selected>${departments[i].name}</option>`);
                    } else {
                        $("#newDepartment").append(`<option value="${departments[i].id}">${departments[i].name}</option>`);
                    }
                }
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`${jqXHR}, ${textStatus}, ${errorThrown}`);
        }
    });

    $("#editPersonnelModal").modal("show");

};

const editDepartmentModal = id => {

    $.ajax({
        url: "libs/php/readDepartmentByID.php",
        type: "POST",
        dataType: 'json',
        data: {
            id: id
        },
        async: false,
        success: function(result) {

            if (result.status.name == "ok") {

                departmentIDtoEdit = result.data[0].id

                //set edit modal content
                $("#newName").attr("value", `${result.data[0].name}`);

                $("#newLocationID").html("");
                //append the options to the location selection when editing
                for (let i = 0; i < locations.length; i++) {

                    //pre-selects the current location in the edit window
                    if (locations[i].id === result.data[0].locationID) {
                        $("#newLocationID").append(`<option value="${locations[i].id}" selected>${locations[i].name}</option>`);
                    } else {
                        $("#newLocationID").append(`<option value="${locations[i].id}">${locations[i].name}</option>`);
                    }
                }
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`${jqXHR}, ${textStatus}, ${errorThrown}`);
        }
    });

    //display the edit modal
    $("#editDepartmentModal").modal("show");

};

const editLocationModal = id => {
    $.ajax({
        url: "libs/php/readLocationByID.php",
        type: "POST",
        dataType: 'json',
        data: {
            id: id
        },
        async: false,
        success: function(result) {

            if (result.status.name == "ok") {

                locationIDtoEdit = result.data[0].id;

                //set edit modal content
                $("#newLocationName").attr("value", `${result.data[0].name}`);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`${jqXHR}, ${textStatus}, ${errorThrown}`);
        }
    });

    $("#editLocationModal").modal("show");

};

const updatePersonnelByID = id => {
    $.ajax({
        url: "libs/php/updatePersonnelByID.php",
        type: "POST",
        dataType: 'json',
        data: {
            id: id,
            firstName: $("#newFirstName").val(),
            lastName: $("#newLastName").val(),
            jobTitle: $("#newJobTitle").val(),
            email: $("#newEmail").val(),
            departmentID: $("#newDepartment").val(),
        },
        success: function(result) {

            if (result.status.name == "ok") {
                $("#editPersonnelModal").modal("hide");
                readAllPersonnel();
            }                
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`${jqXHR}, ${textStatus}, ${errorThrown}`);
        }
    });
};

const updateDepartmentByID = id => {
    $.ajax({
        url: "libs/php/updateDepartmentByID.php",
        type: "POST",
        dataType: 'json',
        data: {
            id: id,
            name: $("#newName").val(),
            locationID: $("#newLocationID").val()
        },
        success: function(result) {

            if (result.status.name == "ok") {
                getAllDepartments();
                $("#editDepartmentModal").modal("hide");
                readAllDepartments();
            }                
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`${jqXHR}, ${textStatus}, ${errorThrown}`);
        }
    });
};

const updateLocationByID = id => {
    $.ajax({
        url: "libs/php/updateLocationByID.php",
        type: "POST",
        dataType: 'json',
        data: {
            id: id,
            name: $("#newLocationName").val()
        },
        success: function(result) {

            if (result.status.name == "ok") {
                getAllLocations();
                $("#editLocationModal").modal("hide");
                readAllLocations();
            }                
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`${jqXHR}, ${textStatus}, ${errorThrown}`);
        }
    });
};

//Delete functions

//set the delete modal functionality
const deletePersonnelModal = id => {
    $.ajax({
        url: "libs/php/readPersonnelByID.php",
        type: "POST",
        dataType: 'json',
        data: {
            id: id
        },
        success: function(result) {

            if (result.status.name == "ok") {

                //set the delete button
                $("#deleteConfirm").attr('onclick', `deletePersonnelByID(${result.data.personnel[0].id})`);
                $("#recordToDelete").html(`${result.data.personnel[0].firstName} ${result.data.personnel[0].lastName}`);
                $("#deleteWarning").modal("show");
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`${jqXHR}, ${textStatus}, ${errorThrown}`);
        }
    });
};

const deleteDepartmentModal = id => {
    $.ajax({
        url: "libs/php/readDepartmentByID.php",
        type: "POST",
        dataType: 'json',
        data: {
            id: id
        },
        success: function(result) {

            if (result.status.name == "ok") {

                //set the delete button
                $("#deleteConfirm").attr('onclick', `deleteDepartmentByID(${result.data[0].id})`);
                $("#recordToDelete").html(`${result.data[0].name}`);
                $("#deleteWarning").modal("show");
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`${jqXHR}, ${textStatus}, ${errorThrown}`);
        }
    });
};

const deleteLocationModal = id => {
    $.ajax({
        url: "libs/php/readLocationByID.php",
        type: "POST",
        dataType: 'json',
        data: {
            id: id
        },
        success: function(result) {

            if (result.status.name == "ok") {

                //set the delete button
                $("#deleteConfirm").attr('onclick', `deleteLocationByID(${result.data[0].id})`);
                $("#recordToDelete").html(`${result.data[0].name}`);
                $("#deleteWarning").modal("show");
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`${jqXHR}, ${textStatus}, ${errorThrown}`);
        }
    });
};

//delete the selected record based on its department

const deleteDepartmentByID = id => {
    $.ajax({
        url: "libs/php/deleteDepartmentByID.php",
        type: "POST",
        dataType: 'json',
        data: {
            id: id
        },
        success: function(result) {

            if (result.status.name == "ok") {

                $("#deleteWarning").modal("hide");
                readAllDepartments();

                if (result.data[0] ===  0) {
                    $("#deleteFailure").modal("show");
                }
            }                
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`${jqXHR}, ${textStatus}, ${errorThrown}`);
        }
    });
};

const deleteLocationByID = id => {
    $.ajax({
        url: "libs/php/deleteLocationByID.php",
        type: "POST",
        dataType: 'json',
        data: {
            id: id
        },
        success: function(result) {

            if (result.status.name == "ok") {

                $("#deleteWarning").modal("hide");
                readAllLocations();

                if (result.data[0] ===  0) {
                    $("#deleteFailure").modal("show");
                }
            }                
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`${jqXHR}, ${textStatus}, ${errorThrown}`);
        }
    });

};

const deletePersonnelByID = id => {
    $.ajax({
        url: "libs/php/deletePersonnelByID.php",
        type: "POST",
        dataType: 'json',
        data: {
            id: id
        },
        success: function(result) {

            if (result.status.name == "ok") {
                
                $("#deleteWarning").modal("hide");
                readAllPersonnel();

                if (result.data[0] ===  0) {
                    $("#deleteFailure").modal("show");
                }
            }                
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`${jqXHR}, ${textStatus}, ${errorThrown}`);
        }
    });
};

//functions for buttons

//"Add New" buttons functionality

// Add new personnel
$("#addNewPersonnel").on("click", () => {
    $("#createPersonnelModal").modal("show");
});

// Add new department
$("#addNewDepartment").on("click", () => {
    $("#createDepartmentModal").modal("show");
});

// Add new location
$("#addNewLocation").on("click", () => {
    $("#createLocationModal").modal("show");
});

//needed to wrap the onclick functions in document.ready to work

// create buttons
 
$(document).on('submit', '#createPersonnel', function(e) {

    //prevents the form submission from redirecting to the main page
    e.preventDefault();
    e.stopPropagation();
    createPersonnel();
});

$(document).on('submit', '#createDepartment', function(e) {

    //prevents the form submission from redirecting to the main page
    e.preventDefault();
    e.stopPropagation();
    createDepartment();
});

$(document).on('submit', '#createLocation', function(e) {

    //prevents the form submission from redirecting to the main page
    e.preventDefault();
    e.stopPropagation();
    createLocation();
});

// read buttons are defined in readAllXXX and readXXXbyID functions, where XXX is personnel, department or location

// update buttons

$(document).on('submit', '#updatePersonnel', function(e) {

    //prevents the form submission from redirecting to the main page
    e.preventDefault();
    e.stopPropagation();
    updatePersonnelByID(personnelIDtoEdit);
});

$(document).on('submit', '#updateDepartment', function(e) {

    //prevents the form submission from redirecting to the main page
    e.preventDefault();
    e.stopPropagation();
    updateDepartmentByID(departmentIDtoEdit);
});

$(document).on('submit', '#updateLocation', function(e) {

    //prevents the form submission from redirecting to the main page
    e.preventDefault();
    e.stopPropagation();
    updateLocationByID(locationIDtoEdit);
});

//radio buttons functionality
$("#employees").on("click", () => {
    readAllPersonnel();
});

$("#departments").on("click", () => {
    readAllDepartments();
});

$("#locations").on("click", () => {
    readAllLocations();
});

//shows personnel info on launch
readAllPersonnel();

//hide the pre-loader after all data had been retrieved successfully
$(window).on('load', function () {
    $('#loader').attr("style", "visibility: hidden;")
});