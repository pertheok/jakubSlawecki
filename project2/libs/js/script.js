//functions for populating the main table

//populate the table with basic personnel info
const readAllPersonnel = () => {

    //set read modal content
    $("#createTitle").html("Create a new employee");
    $("#createBody").html(`
        <form id="createPersonnel">
            <div class="form-group">
                <input type="text" class="form-control m-1" id="firstName" placeholder="First Name" required>
                <input type="text" class="form-control m-1" id="lastName" placeholder="Last Name" required>
                <input type="text" class="form-control m-1" id="jobTitle" placeholder="Job Title (optional)" value=''>
                <input type="email" class="form-control m-1" id="email" placeholder="Email (optional)">
                <input type="number" class="form-control m-1" id="departmentID" placeholder="Department ID" required>
            </div>
            <div class="text-center">
                <button type="submit" class="btn btn-primary">
                    Create
                </button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                    Close
                </button>
            </div>
        </form>
    `);

    $.ajax({
        url: "libs/php/readAllPersonnel.php",
        type: "POST",
        dataType: 'json',
        success: function(result) {

            if (result.status.name == "ok") {

                //set the header
                $("#tableTitle").html("Employees Database");

                //clear the results table
                $("thead").html("");
                $("tbody").html("");

                //set the button description
                $("#addNewButtonText").html(`Add a new Employee`);

                //set the table header - certain columns are displayed only on certain display sizes to prevent overflowing
                $("#tableHeaders").append(
                    `<tr class="sticky-top">
                        <th class="d-none d-lg-table-cell">
                            ID
                        </th>
                        <th>
                            Last Name
                        </th>
                        <th class="d-none d-md-table-cell">
                            First Name
                        </th>
                        <th class="d-none d-lg-table-cell">
                            Job title
                        </th>
                        <th class="d-none d-md-table-cell">
                            Email
                        </th>
                        <th>
                            Department
                        </th>
                        <th class="d-none d-md-table-cell">
                            Location
                        </th>
                        <th>
                            Actions
                        </th>
                    </tr>`
                );

                //set the table body with the requested info - certain columns are displayed only on certain display sizes to prevent overflowing
                for (let i = 0;  i < result.data.length; i++) {
                    $("#tableData").append(
                        `<tr>
                            <td class="d-none d-lg-table-cell">
                                ${result.data[i].id}
                            </td>
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
                                <span class="m-1 fa fa-pencil">
                                </span>
                                <span class="m-1 fa fa-trash">
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
};

//variable to store available department names for later use
let departments = [];

//populate the table with department info
const readAllDepartments = () => {

    //set read modal content
    $("#createTitle").html("Create a new Department");
    $("#createBody").html(`
        <form id="createDepartment">
            <div class="form-group">
                <input type="text" class="form-control m-1" id="departmentName" placeholder="Department Name" required>
                <input type="number" class="form-control m-1" id="locationID" placeholder="Location ID" required>
            </div>
            <div class="text-center">
                <button type="submit" class="btn btn-primary">
                    Create
                </button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                    Close
                </button>
            </div>
        </form>
    `);

    $.ajax({
        url: "libs/php/readAllDepartments.php",
        type: "POST",
        dataType: 'json',
        success: function(result) {

            if (result.status.name == "ok") {

                //populate the departments array
                for (let i = 0; i < result.data.length; i++) {
                    departments[i] = {id: result.data[i].id, name: result.data[i].name};
                }

                 //set the header
                 $("#tableTitle").html("Departments Database");

                //clear the results table and the "Add New" button
                $("thead").html("");
                $("tbody").html("");
                
                //set the button description
                $("#addNewButtonText").html(`Add a new Department`);

                //set the table header
                $("#tableHeaders").append(
                    `<tr class="sticky-top">
                        <th>
                            ID
                        </th>
                        <th>
                            Name
                        </th>
                        <th>
                            Location
                        </th>
                        <th>
                            Actions
                        </th>
                    </tr>`
                );

                //set the table body with the requested info
                for (let i = 0;  i < result.data.length; i++) {
                    $("#tableData").append(
                        `<tr>
                            <td>
                                ${result.data[i].id}
                            </td>
                            <td>
                                ${result.data[i].name}
                            </td>
                            <td>
                                ${result.data[i].location}
                            </td>
                            <td>
                                <span class="m-1 fa fa-eye" onclick="readDepartmentByID(${result.data[i].id});">
                                </span>
                                <span class="m-1 fa fa-pencil">
                                </span>
                                <span class="m-1 fa fa-trash">
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

};

//call the readAllDepartments function once to populate the departments array
readAllDepartments();

//variable to store available location names for later use
let locations = [];

//populate the table with location info
const readAllLocations = () => {

    //set read modal content
    $("#createTitle").html("Create a new Location");
    $("#createBody").html(`
        <form id="createLocation">
            <div class="form-group">
                <input type="text" class="form-control m-1" id="locationName" placeholder="Location Name" required>
            </div>
            <div class="text-center">
                <button type="submit" class="btn btn-primary">
                    Create
                </button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                    Close
                </button>
            </div>
        </form>
    `);

    $.ajax({
        url: "libs/php/readAllLocations.php",
        type: "POST",
        dataType: 'json',
        success: function(result) {

            if (result.status.name == "ok") {

                //populate the locations array
                for (let i = 0; i < result.data.length; i++) {
                    locations[i] = {id: result.data[i].id, name: result.data[i].name};
                }

                 //set the header
                 $("#tableTitle").html("Locations Database");

                //clear the results table
                $("thead").html("");
                $("tbody").html("");

                //set the button description
                $("#addNewButtonText").html(`Add a new Location`);

                //set the table header
                $("#tableHeaders").append(
                    `<tr class="sticky-top">
                        <th>
                            ID
                        </th>
                        <th>
                            Name
                        </th>
                        <th>
                            Actions
                        </th>
                    </tr>`
                );

                //set the table body with the requested info
                for (let i = 0;  i < result.data.length; i++) {
                    $("#tableData").append(
                        `<tr>
                            <td>
                                ${result.data[i].id}
                            </td>
                            <td>
                                ${result.data[i].name}
                            </td>
                            <td>
                                <span class="m-1 fa fa-eye" onclick="readLocationByID(${result.data[i].id});">
                                </span>
                                <span class="m-1 fa fa-pencil">
                                </span>
                                <span class="m-1 fa fa-trash">
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
};

//call the readAllLocations function once to populate the locations array
readAllLocations();

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
                $("#createModal").modal("hide");
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
                $("#createModal").modal("hide");
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
                $("#createModal").modal("hide");
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

                //set view modal content
                $("#modalTitle").html("Employee record");
                $("#modalBody").html(`
                    <table class="table table-striped">
                        <tbody>
                            <tr>
                                <th>
                                    ID
                                </th>
                                <td>
                                    ${result.data.personnel[0].id}
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    Last Name
                                </th>
                                <td>
                                    ${result.data.personnel[0].lastName}
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    First Name
                                </th>
                                <td>
                                    ${result.data.personnel[0].firstName}
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    Job Title
                                </th>
                                <td>
                                    ${result.data.personnel[0].jobTitle ? result.data.personnel[0].jobTitle : ''}
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    Email
                                </th>
                                <td>
                                    ${result.data.personnel[0].email}
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    Department
                                </th>
                                <td id="currentDepartment">
                                    ${result.data.personnel[0].department}
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    Location
                                </th>
                                <td>
                                    ${result.data.personnel[0].location}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                `);

                //set edit modal content
                $("#editTitle").html("Edit record");
                $("#editBody").html(`
                    <table class="table table-striped">
                        <tbody>
                            <tr>
                                <th>
                                    ID
                                </th>
                                <td>
                                    ${result.data.personnel[0].id}
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    Last Name
                                </th>
                                <td>
                                    <input type="text" id="newLastName" value="${result.data.personnel[0].lastName}">
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    First Name
                                </th>
                                <td>
                                    <input type="text" id="newFirstName" value="${result.data.personnel[0].firstName}">
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    Job Title
                                </th>
                                <td>
                                    <input type="text" id="newJobTitle" value="${result.data.personnel[0].jobTitle ? result.data.personnel[0].jobTitle : ''}">
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    Email
                                </th>
                                <td>
                                    <input type="email" id="newEmail" value="${result.data.personnel[0].email}">
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    Department
                                </th>
                                <td>
                                    <select name="department" id="newDepartment">
                                    </select>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                `);

                //append the options to the department selection when editing
                for (let i = 0; i < departments.length; i++) {

                    //pre-selects the current department in the edit window
                    if (departments[i].id == result.data.personnel[0].departmentID) {
                        $("select").append(`<option value="${departments[i].id}" selected>${departments[i].name}</option>`);
                    } else {
                        $("select").append(`<option value="${departments[i].id}">${departments[i].name}</option>`);
                    }
                }

                //sort the departments on the dropdown menu alphabetically
                $("#newDepartment").html($("option").sort((a, b) => {
                    return a.text == b.text ? 0 : a.text < b.text ? -1 : 1
                }));

                //set the edit button
                $("#editConfirm").attr('onclick', `updatePersonnelByID(${result.data.personnel[0].id})`);

                //set the delete button
                $("#deleteConfirm").attr('onclick', `deletePersonnelByID(${result.data.personnel[0].id})`);

                //display the read modal
                $("#viewModal").modal("show");
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
                $("#modalTitle").html("Department record");
                $("#modalBody").html(`
                    <table class="table table-striped">
                        <tbody>
                            <tr>
                                <th>
                                    ID
                                </th>
                                <td>
                                    ${result.data[0].id}
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    Name
                                </th>
                                <td>
                                    ${result.data[0].name}
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    Location
                                </th>
                                <td>
                                    ${result.data[0].location}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                `);

                //set edit modal content
                $("#editTitle").html("Edit record");
                $("#editBody").html(`
                    <table class="table table-striped">
                        <tbody>
                            <tr>
                                <th>
                                    ID
                                </th>
                                <td>
                                    ${result.data[0].id}
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    Name
                                </th>
                                <td>
                                    <input type="text" id="newName" value="${result.data[0].name}">
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    Location
                                </th>
                                <td>
                                    <select name="location" id="newLocationID">
                                    </select>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                `);

                //append the options to the location selection when editing
                for (let i = 0; i < locations.length; i++) {

                    //pre-selects the current location in the edit window
                    if (locations[i].id == result.data[0].locationID) {
                        $("select").append(`<option value="${locations[i].id}" selected>${locations[i].name}</option>`);
                    } else {
                        $("select").append(`<option value="${locations[i].id}">${locations[i].name}</option>`);
                    }
                }

                //sort the locations on the dropdown menu alphabetically
                $("#newLocationID").html($("option").sort((a, b) => {
                    return a.text == b.text ? 0 : a.text < b.text ? -1 : 1
                }));

                //set the edit button
                $("#editConfirm").attr('onclick', `updateDepartmentByID(${result.data[0].id})`);

                //set the delete button
                $("#deleteConfirm").attr('onclick', `deleteDepartmentByID(${result.data[0].id})`);

                //display the read modal
                $("#viewModal").modal("show");
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
                $("#modalTitle").html("Location record");
                $("#modalBody").html(`
                    <table class="table table-striped">
                        <tbody>
                            <tr>
                                <th>
                                    ID
                                </th>
                                <td>
                                    ${result.data[0].id}
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    Name
                                </th>
                                <td>
                                    ${result.data[0].name}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                `);

                //set edit modal content
                $("#editTitle").html("Edit record");
                $("#editBody").html(`
                    <table class="table table-striped">
                        <tbody>
                            <tr>
                                <th>
                                    ID
                                </th>
                                <td>
                                    ${result.data[0].id}
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    Name
                                </th>
                                <td>
                                    <input type="text" id="newLocationName" value="${result.data[0].name}">
                                </td>
                            </tr>
                        </tbody>
                    </table>
                `);

                //set the edit button
                $("#editConfirm").attr('onclick', `updateLocationByID(${result.data[0].id})`);

                //set the delete button
                $("#deleteConfirm").attr('onclick', `deleteLocationByID(${result.data[0].id})`);

                //display the read modal
                $("#viewModal").modal("show");
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`${jqXHR}, ${textStatus}, ${errorThrown}`);
        }
    });

};

//Update functions

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
                $("#editModal").modal("hide");
                readAllPersonnel();
                readPersonnelByID(id);
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
                $("#editModal").modal("hide");
                readAllDepartments();
                readDepartmentByID(id);
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
                $("#editModal").modal("hide");
                readAllLocations();
                readLocationByID(id);
            }                
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`${jqXHR}, ${textStatus}, ${errorThrown}`);
        }
    });
};

//Delete functions

//set the delete modal functionality

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
                $("#viewModal").modal("hide");
                $("#deleteWarning").modal("hide");
                readAllDepartments();
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
                $("#viewModal").modal("hide");
                $("#deleteWarning").modal("hide");
                readAllLocations();
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
                $("#viewModal").modal("hide");
                $("#deleteWarning").modal("hide");
                readAllPersonnel();
            }                
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`${jqXHR}, ${textStatus}, ${errorThrown}`);
        }
    });
};

//functions for buttons

//"Add New" buttons functionality
$("#addNewButton").on("click", () => {
    $("#createModal").modal("show");
});

//show the delete modal
$("#deleteButton").on("click", () => {
    $("#deleteWarning").modal("show");
});

//show the edit modal
$("#editButton").on("click", () => {
    $("#editModal").modal("show");
});

//needed to wrap the onclick functions in document.ready to work

$(document).on('submit', '#createPersonnel', function(e) {

    //prevents the form submission from redirecting to the main page
    e.preventDefault();
    createPersonnel();
});

$(document).on('submit', '#createDepartment', function(e) {

    //prevents the form submission from redirecting to the main page
    e.preventDefault();
    createDepartment();
});

$(document).on('submit', '#createLocation', function(e) {

    //prevents the form submission from redirecting to the main page
    e.preventDefault();
    createLocation();
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