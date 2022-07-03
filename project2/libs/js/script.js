//functions for populating the main table

//populate the table with basic personnel info
const readAllPersonnel = () => {
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

                //set the button HTML
                $("#buttonContainer").html(`
                    <button id="addNewPersonnel" class="btn btn-success text-center">
                        <i class="fa fa-plus">
                        </i>
                        Add a new Employee
                    </button>
                `);

                //set the table header
                $("#tableHeaders").append(
                    `<tr class="sticky-top">
                        <th>
                            Last Name
                        </th>
                        <th>
                            First Name
                        </th>
                        <th>
                            Department
                        </th>
                        <th>
                            Actions
                        </th>
                    </tr>`
                );

                //set the table body with the requested info
                for (let i = 0;  i < result.data.length; i++) {
                    $("#tableData").append(
                        `<tr id="employee${i}">
                            <td>
                                ${result.data[i].lastName}
                            </td>
                            <td>
                                ${result.data[i].firstName}
                            </td>
                            <td>
                                ${result.data[i].department}
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
                
                //set the button HTML
                $("#buttonContainer").html(`
                    <button id="addNewDepartment" class="btn btn-success text-center">
                        <i class="fa fa-plus">
                        </i>
                        Add a new Department
                    </button>
                `);

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

                //set the button HTML
                $("#buttonContainer").html(`
                    <button id="addNewLocation" class="btn btn-success text-center">
                        <i class="fa fa-plus">
                        </i>
                        Add a new Location
                    </button>
                `);

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

//modifying the CRUD modal contents

//Create a new employee

const createPersonnelModal = () => {
    $("#modalTitle").html("Create a new employee");
    $("#modalBody").html(`
        <form>
            <div class="form-group">
                <input type="text" class="form-control m-1" id="firstName" placeholder="First Name" required>
                <input type="text" class="form-control m-1" id="lastName" placeholder="Last Name" required>
                <input type="text" class="form-control m-1" id="jobTitle" placeholder="Job Title">
                <input type="email" class="form-control m-1" id="email" placeholder="Email">
                <input type="number" class="form-control m-1" id="departmentID" placeholder="Department ID" required>
            </div>
            <button type="submit" id="submitPersonnel" class="btn btn-primary">Create</button>
        </form>
    `);

    $("#crudModal").modal("show");
};

const createDepartmentModal = () => {
    $("#modalTitle").html("Create a new Department");
    $("#modalBody").html(`
        <form>
            <div class="form-group">
                <input type="text" class="form-control m-1" id="name" placeholder="Department Name" required>
                <input type="number" class="form-control m-1" id="locationID" placeholder="Location ID" required>
            </div>
            <button type="submit" id="submitDepartment" class="btn btn-primary">Create</button>
        </form>
    `);

    $("#crudModal").modal("show");
};

const createLocationModal = () => {
    $("#modalTitle").html("Create a new Location");
    $("#modalBody").html(`
        <form>
            <div class="form-group">
                <input type="text" class="form-control m-1" id="name" placeholder="Location Name" required>
            </div>
            <button type="submit" id="submitLocation" class="btn btn-primary">Create</button>
        </form>
    `);

    $("#crudModal").modal("show");
};


//functions for buttons

//"Add New" buttons functionality
$("#addNewPersonnel").on("click", () => {
    createPersonnelModal();
});

$("#addNewDepartment").on("click", () => {
    createPersonnelModal();
});

$("#addNewLocation").on("click", () => {
    createLocationModal();
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