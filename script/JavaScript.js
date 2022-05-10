
$(document).ready(function () {
    $("#collapse").on("click", () => {
        $("#sidebar").toggleClass("active");

    })
    $("#user").on("click", () => {
        $("#main-iframe").toggleSrc("/user");
    })
})
function main_iframe(e) {
    document.getElementById("main-iframe").src = `${e}`
}


$('#table tr').click(function () {
    $(this).not('#header-tr').addClass('selected').siblings().removeClass('selected')
    let box = $('#table tr.selected').text().split(/\r?\n/)

    //index 2= account
    //index 5= password
    //index 8= Name
    //index 11= permission
    //index 14= Division
    //index 17 = Profession
    document.getElementById('account').value = box[2].trim()
    document.getElementById('password').value = box[5].trim()
    document.getElementById('Name').value = box[8].trim()
    document.getElementById('permission').value = box[11].trim()
    document.getElementById('Division').value = box[14].trim()
    document.getElementById('Profession').value = box[17].trim()


})