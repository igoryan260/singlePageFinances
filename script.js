const Modal = {
        open() {
            //abrir modal
            //adicionar a class 'active' ao modal
            document
                .querySelector('.modal-overlay')
                .classList
                .add('active')
        },
        close() {
            document.querySelector('.modal-overlay')
                .classList.remove('active')
        }
    }
    /*Eu preciso somar as entradas depois eu preciso somar as saidas e remover das entradas o valor das saídas assim, eu terei o total*/
const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },

    set(transactions) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    }
}

const Transaction = {

        all: Storage.get(),

        add(transaction) {
            Transaction.all.push(transaction)
            App.reload()
        },

        remove(index) {
            Transaction.all.splice(index, 1)

            App.reload()
        },
        incomes() {
            // somar as entradas
            //pegar todas as transações 

            let income = 0;

            Transaction.all.forEach((transaction) => {
                //para cada transação, verificar se é maior que zero        

                if (transaction.amount > 0) {
                    //somar a uma variável e retornar a variável
                    income += transaction.amount;
                }
            })

            return income;
        },
        expenses() {
            //somar as saidas
            let expense = 0

            Transaction.all.forEach(function(transaction) {
                if (transaction.amount < 0) {
                    expense += transaction.amount;
                }
            })

            return expense
        },
        total() {
            let total = 0
                //subtrair das entradas o valor das saidas
            total = Transaction.incomes() + Transaction.expenses()
            return total
        }
    }
    //eu preciso pegar as minhas transações no meu 
    //objeto aqui no JS
    //e colocar lá no html

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction)
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction, index) {

        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html =
            `        
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})"src="assets/minus.svg" alt="remover transação" />
            </td>        
        `
        return html
    },

    updateBalance() {
        document.getElementById('income-display').innerHTML = Utils.formatCurrency(Transaction.incomes())
        document.getElementById('expense-display').innerHTML = Utils.formatCurrency(Transaction.expenses())
        document.getElementById('total-display').innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Utils = {

    formatAmount(value) {
        value = Number(value) * 100

        return value
    },

    formatDescription(value) {
        value = String(value)
        return value
    },

    formatDate(date) {
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return signal + value
    }
}

const Form = {

    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    //verificar se todas a informações estão preenchidas
    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },
    //validar os dados preenchidos
    validateFields() {
        const { description, amount, date } = Form.getValues();
        if (description.trim() === "" ||
            amount.trim() === "" ||
            date.trim() === "") {
            throw new Error("Preencha todos os campos")
        }
    },
    //formatar os dados para salvar
    formatValues() {
        let { description, amount, date } = Form.getValues()

        amount = Utils.formatAmount(amount)

        description = Utils.formatDescription(description)

        date = Utils.formatDate(date)

        return {
            description,
            amount,
            date
        }

    },

    saveTransactions(transaction) {
        Transaction.add(transaction)
    },

    clearFields() {
        descrption = ""
        amount = ""
        date = ""
    },

    //formatDate() {
    submit(event) {
        event.preventDefault()

        try {

            Form.validateFields()

            const transaction = Form.formatValues()
                //salvar
            Form.saveTransactions(transaction)
                //apagar os dados do formulário
            Form.clearFields()
                //fechar a janela do formulário
            Modal.close()


        } catch (error) {
            alert(error.message)
        }
    }
}

// fim do formulário

const App = {
    init() {
        Transaction.all.forEach((transaction, index) => {
            DOM.addTransaction(transaction, index)
        })
        DOM.updateBalance()
        Storage.set(Transaction.all)
    },
    reload() {
        DOM.clearTransactions()
        App.init()
    }
}

App.init()