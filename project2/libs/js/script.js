//functions for populating the main table

//populate the table with basic personnel info
const readAllPersonnel = () => {

    //set CRUD modal content
    $("#modalTitle").html("Create a new employee");
    $("#modalBody").html(`
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
            </div>
        </form>
    `);

    $.ajax({
        url: "libs/php/readAllPersonnel.php",
        type: "GET",
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
                        `<tr id="employee${i}">
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
                                <span class="fa fa-eye">
                                </span>
                                <span class="fa fa-pencil">
                                </span>
                                <span class="fa fa-trash">
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

//populate the table with department info
const readAllDepartments = () => {

    //set CRUD modal content
    $("#modalTitle").html("Create a new Department");
    $("#modalBody").html(`
        <form id="createDepartment">
            <div class="form-group">
                <input type="text" class="form-control m-1" id="departmentName" placeholder="Department Name" required>
                <input type="number" class="form-control m-1" id="locationID" placeholder="Location ID" required>
            </div>
            <div class="text-center">
                <button type="submit" class="btn btn-primary">
                    Create
                </button>
            </div>
        </form>
    `);

    $.ajax({
        url: "libs/php/readAllDepartments.php",
        type: "GET",
        dataType: 'json',
        success: function(result) {

            if (result.status.name == "ok") {

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
                        `<tr id="department${i}">
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
                                <span class="fa fa-eye">
                                </span>
                                <span class="fa fa-pencil">
                                </span>
                                <span class="fa fa-trash">
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

//populate the table with location info
const readAllLocations = () => {

    //set CRUD modal content
    $("#modalTitle").html("Create a new Location");
    $("#modalBody").html(`
        <form id="createLocation">
            <div class="form-group">
                <input type="text" class="form-control m-1" id="locationName" placeholder="Location Name" required>
            </div>
            <div class="text-center">
                <button type="submit" class="btn btn-primary">
                    Create
                </button>
            </div>
        </form>
    `);

    $.ajax({
        url: "libs/php/readAllLocations.php",
        type: "GET",
        dataType: 'json',
        success: function(result) {

            if (result.status.name == "ok") {

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
                        `<tr id="department${i}">
                            <td>
                                ${result.data[i].id}
                            </td>
                            <td>
                                ${result.data[i].name}
                            </td>
                            <td>
                                <span class="fa fa-eye">
                                </span>
                                <span class="fa fa-pencil">
                                </span>
                                <span class="fa fa-trash">
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

//Create functions

const createPersonnel = () => {

    $.ajax({
        url: "libs/php/createPersonnel.php",
        type: "POST",
        dataType: 'json',
        data: {
            firstName: $("#firstName").val(),
            lastName: $("#lastName").val(),
            jobTitile: $("#jobTitle").val(),
            email: $("#email").val(),
            departmentID: $("#departmentID").val()
        },
        success: function(result) {

            if (result.status.name == "ok") {
                $("#crudModal").modal("hide");
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
                $("#crudModal").modal("hide");
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
                $("#crudModal").modal("hide");
                readAllLocations();
            }                
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`${jqXHR}, ${textStatus}, ${errorThrown}`);
        }
    });

};

//Read functions

const readDepartmentByID = () => {

};

const readLocationByID = () => {

};

const readPersonnelByID = () => {

};

//Update functions

const updateDepartmentByID = () => {
    $.ajax({
        url: "libs/php/updateDepartmentByID.php",
        type: "PUT",
        dataType: 'json',
        data: {
            id: $("#departmentName").val(),
            name: $("#departmentName").val(),
            locationID: $("#departmentName").val()
        },
        success: function(result) {

            if (result.status.name == "ok") {
                $("#crudModal").modal("hide");
                readAllDepartments();
            }                
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`${jqXHR}, ${textStatus}, ${errorThrown}`);
        }
    });
};

const updateLocationByID = () => {
    $.ajax({
        url: "libs/php/updateLocationByID.php",
        type: "PUT",
        dataType: 'json',
        data: {
            id: $("#departmentName").val(),
            name: $("#departmentName").val()
        },
        success: function(result) {

            if (result.status.name == "ok") {
                $("#crudModal").modal("hide");
                readAllLocations();
            }                
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`${jqXHR}, ${textStatus}, ${errorThrown}`);
        }
    });
};

const updatePersonnelByID = () => {
    $.ajax({
        url: "libs/php/updatePersonnelByID.php",
        type: "PUT",
        dataType: 'json',
        data: {
            id: $("#departmentName").val()
        },
        success: function(result) {

            if (result.status.name == "ok") {
                $("#crudModal").modal("hide");
                readAllDepartments();
            }                
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`${jqXHR}, ${textStatus}, ${errorThrown}`);
        }
    });
};

//Delete functions

const deleteDepartmentByID = () => {
    $.ajax({
        url: "libs/php/deleteDepartmentByID.php",
        type: "DELETE",
        dataType: 'json',
        data: {
            id: $("#departmentName").val()
        },
        success: function(result) {

            if (result.status.name == "ok") {
                $("#crudModal").modal("hide");
                readAllDepartments();
            }                
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`${jqXHR}, ${textStatus}, ${errorThrown}`);
        }
    });
};

const deleteLocationByID = () => {
    $.ajax({
        url: "libs/php/deleteLocationByID.php",
        type: "DELETE",
        dataType: 'json',
        data: {
            id: $("#departmentName").val()
        },
        success: function(result) {

            if (result.status.name == "ok") {
                $("#crudModal").modal("hide");
                readAllLocations();
            }                
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`${jqXHR}, ${textStatus}, ${errorThrown}`);
        }
    });

};

const deletePersonnelByID = () => {
    $.ajax({
        url: "libs/php/deletePersonnelByID.php",
        type: "DELETE",
        dataType: 'json',
        data: {
            id: $("#departmentName").val()
        },
        success: function(result) {

            if (result.status.name == "ok") {
                $("#crudModal").modal("hide");
                readAllDepartments();
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
    $("#crudModal").modal("show");
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