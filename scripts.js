// Limpa pagina
const refund = document.querySelector("main img")

// Seleciona os elementos do formulário.
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

//Seleciona os elementos da lista
 const expenseList = document.querySelector("ul")
 const expensesQuantity = document.querySelector("aside header p span")
 const expensesTotal = document.querySelector("aside header h2")


//Atualiza a pagina para limpar solicitações
refund.addEventListener("click", () => {
    // Atualiza a pagina
    location.reload()


})

// Captura o evento de inpute para poder manipular o valor.
amount.oninput = () => {
    // Remove os caracteres não númericos
    let value = amount.value.replace(/\D/g, "")

    //Transformando o valor em centavos
    value = Number(value) / 100

    //Atualiza o valor no input.
    amount.value = formatCurrencyBRL(value)
}

//Formata o valor no padrão BRL (Real Brasileiro).
function formatCurrencyBRL(value) {
    value = value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    })

    //Retorna o Valor formatado
    return value
}

// Captura o evento de submit do formulario para obter os valores
form.onsubmit = (event) => {
    // Previne o comportamento de atualizar a página
    event.preventDefault()

    // Cria um objeto com os detalhes na nova despesa.
    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date(),
    }

    // Chama a função que adiciona um item na lista.
    expenseAdd(newExpense) 

}

// Adiciona um novo item na lista.
function expenseAdd(newExpense){
    try {
        //Cria o elemento de li para adicionar o item (li) na lista (ul).
        const expenseItem = document.createElement("li")
        expenseItem.classList.add("expense")

        // Cria o icone da Categoria.
        const expenseIcon = document.createElement("img")
        expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
        expenseIcon.setAttribute("alt", newExpense.category_name)

        // Cria as Informações da Despesa
        const expenseInfo = document.createElement("div")
        expenseInfo.classList.add("expense-info")

        // Cria o nome da despesa.
        const expenseName = document.createElement("strong")
        expenseName.textContent = newExpense.expense

        // Cria a categoria da despesa
        const expenseCategory = document.createElement("span")
        expenseCategory.textContent = newExpense.category_name

        // Adiciona nome e categoria na div das informações da despesa.
        expenseInfo.append(expenseName, expenseCategory)


        //cria o valor da dispesa.
        const expenseAmount = document.createElement("span")
        expenseAmount.classList.add("expense-amount")
        expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")}`

        // Cria icone de remover
        const removeIcon = document.createElement("img")
        removeIcon.classList.add("remove-icon")
        removeIcon.setAttribute("src", "img/remove.svg")
        removeIcon.setAttribute("alt", "remover")

        //Adiciona as informações no item
        expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

        //Adiciona o Item na lista
        expenseList.append(expenseItem)

        // Limpa o formulário para adicionar um novo item.
        formClear()

        // Atualiza os Totais 
        updateTotais()
        
    } catch (error) {
        alert("Não foi possível atualizar a lista de despesas.")
        console.log(error)
    }
}

// Atualiza os totais.
function updateTotais(){
    try {
        // Recupera todos os itens (li) da lista (ul)
        const itens = expenseList.children
        
        // Atualiza a quantidade de itens da lista
        expensesQuantity.textContent = `${itens.length} ${
            itens.length > 1 ? "despesas" : "despesa"
        }`
        
        // Variavel para incrementar o total
        let total = 0

        // Percorre cada item (li) da lista (ul)
        for(let item = 0; item < itens.length; item++){
            const itemAmount = itens[item].querySelector(".expense-amount")

            // Remove caracteres não numericos e subistitui a virgula por ponto.
            let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",",".")

            // Converte o valor para float.
            value = parseFloat(value)

            // Verifica se é um número válido.
            if (isNaN(value)){
                return alert(
                    "Não foi possivel calcular o total. O valor não parece ser um número."
                )
            }

            // Incrementa o valor total.
            total += Number(value)
        }

        // Cria a span para adicionar o R$ formatado.
        const symbolBRL = document.createElement("small")
        symbolBRL.textContent = "R$"

        // Formata o valor e remove o R$ que seré exibido pela small com um estilo customizado.
        total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

        // Limpa o conteúdo do elemento.
        expensesTotal.innerHTML = ""

        // Adiciona o símbolo da moeda e o valor total formatado
        expensesTotal.append(symbolBRL, total)

    } catch (error) {
        console.log(error)
        alert("não foi possível atualizar os totais.")
    }
}

// Evento que captura o clique nos itens da lista.
expenseList.addEventListener("click", function (event) {
    //verifica se o elemento clicado é o ícone de remover.
    if (event.target.classList.contains("remove-icon")){
        //Obtém a li pai do elemento clicado
        const item = event.target.closest(".expense")

        // Remove item da Lista
        item.remove()
    }

    // Atualiza valores do total
    updateTotais()
} )

// Limpa os inputs.
function formClear() {
    expense.value = ""
    category.value = ""
    amount.value = ""

    // Coloca o foco no input de amount.
    expense.focus()
}