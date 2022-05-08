
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