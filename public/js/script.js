function valida_pergunta (){
        if(document.getElementById("user","title","description").value.length < 3){
        alert('Todos os campos devem ter no mínimo 3 caracteres')
        document.getElementById("user","title","description").focus()
        return false
    }
}

function valida_resposta (){
    if(document.getElementById("user","resposta").value.length < 3){
    alert('Todos os campos devem ter no mínimo 3 caracteres')
    document.getElementById("usuario","resposta").focus()
    return false
    }
}