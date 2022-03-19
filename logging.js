



function print_success(msg){
    console.log(`✅ ${msg}`);
}


function print_alert(msg){
    console.log(`⚠️ ${msg}`);
}

function print_wait(msg){
    console.log(`⌛ ${msg}`);
}


module.exports = {print_success, print_alert, print_wait}