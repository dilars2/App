const { select, input, checkbox } = require('@inquirer/prompts')

let mensagem = "Bem vindo ao app de metas";

let meta = {
    value: 'Tomar 3L de água por dia',
    checked: false,
}

let metas = [meta]

const cadastrarMeta = async () => {
    const meta = await input({ message: "Digite a meta:" })

    if (meta.length == 0) {
        mensagem = 'A meta não pode ser vazia.'
        return
    }

    metas.push(
        { value: meta, checked: false }
    )

    mensagem = "Meta cadastrada com sucesso! :)"
}

const listarMetas = async () => {
    const respostas = await checkbox({
        message: "Use as setas para mudar de meta, o espaço para marcar ou desmarcar e o enter para finalizar essa etapa",
        choices: [...metas],
        instructions: false,
    })

    if (respostas.length == 0) {
        mensagem = "Nenhuma meta selecionada!"
        return
    }

    // Resetar todas as metas como não concluídas
    metas.forEach((m) => {
        m.checked = false
    })

    // Marcar apenas as selecionadas
    respostas.forEach((resposta) => {
        const meta = metas.find((m) => {
            return m.value == resposta
        })
        meta.checked = true
    })

    mensagem = 'Meta(s) concluída(s)'
}

const metasRealizadas = async () => {
    const realizadas = metas.filter((meta) => {
        return meta.checked
    })

    if (realizadas.length == 0) {
        mensagem = 'Não existem metas realizadas! :('
        return
    }

    await select({
        message: "Metas realizadas: " + realizadas.length,
        choices: [...realizadas]
    })

    mensagem = realizadas.length + " meta(s) realizadas"
}

const metasAbertas = async () => {
    const abertas = metas.filter((meta) => {
        return meta.checked != true
    })

    if (abertas.length == 0) {
        mensagem = "Não existem metas abertas :)"
        return
    }

    await select({
        message: "Metas Abertas: " + abertas.length,
        choices: [...abertas]
    })

    mensagem = abertas.length + " meta(s) abertas"
}

const itensADeletar = async () => {
    const metasDesmarcadas = metas.map((meta) => {
        return { value: meta.value }
    })

    const respostas = await checkbox({
        message: "Selecione item para deletar",
        choices: [...metasDesmarcadas],
        instructions: false,
    })

    if (respostas.length == 0) {
        mensagem = "Nenhum item selecionado para deletar!"
        return
    }

    respostas.forEach((item) => {
        metas = metas.filter((meta) => {
            return meta.value != item
        })
    })

    mensagem = "Meta(s) deletada(s) com sucesso!"
}

const mostrarMensagem = () => {
    if (mensagem != "") {
        console.clear();
        console.log(mensagem)
        console.log("")
        mensagem = ""
    }
}

const start = async () => {

    while (true) {

        // Mostrar mensagem antes de cada ação
        mostrarMensagem()

        const opcao = await select({
            message: "Menu >",
            choices: [
                {
                    name: "Cadastrar meta",
                    value: "cadastrar"
                },
                {
                    name: "Listar metas",
                    value: "listar"
                },
                {
                    name: "Metas realizadas",
                    value: "realizadas"
                },
                {
                    name: "Deletar metas",
                    value: "deletar"
                },
                {
                    name: "Metas abertas",
                    value: "abertas"
                },
                {
                    name: "Sair",
                    value: "sair"
                }
            ]
        })

        switch (opcao) {
            case "cadastrar":
                await cadastrarMeta()
                break
            case "listar":
                await listarMetas()
                break
            case "realizadas":
                await metasRealizadas()
                break
            case "abertas":
                await metasAbertas()
                break
            case "deletar":
                await itensADeletar()
                break
            case "sair":
                console.log("Até a próxima!")
                return
        }
    }
}

start()