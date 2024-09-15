const { select, input, checkbox } = require('@inquirer/prompts');
const fs = require("fs").promises;

let mensagem = "Bem-vindo ao app de metas";

let metas = [];

const carregarMetas = async () => {
    try {
        const dados = await fs.readFile("metas.json", "utf-8");
        metas = JSON.parse(dados);

        if (!Array.isArray(metas)) {
            metas = [];
        }
    } catch (erro) {
        metas = [];
    }
};

const salvarMetas = async () => {
    await fs.writeFile("metas.json", JSON.stringify(metas, null, 2));
};

const cadastrarMeta = async () => {
    const meta = await input({ message: "Digite a meta:" });

    if (meta.length == 0) {
        mensagem = 'A meta não pode ser vazia.';
        return;
    }

    metas.push(
        { value: meta, checked: false }
    );

    mensagem = "Meta cadastrada com sucesso! :)";
};

const listarMetas = async () => {
    if (metas.length == 0) {
        mensagem = "Não existem metas!";
        return;
    }

    const respostas = await checkbox({
        message: "Use as setas para mudar de meta, o espaço para marcar ou desmarcar e o enter para finalizar essa etapa",
        choices: metas.map(meta => ({ name: meta.value, value: meta.value, checked: meta.checked })),
        instructions: false,
    });

    if (respostas.length == 0) {
        mensagem = "Nenhuma meta selecionada!";
        return;
    }

        metas.forEach((m) => {
        m.checked = false;
    });

        respostas.forEach((resposta) => {
        const meta = metas.find((m) => m.value === resposta);
        if (meta) {
            meta.checked = true;
        }
    });

    mensagem = 'Meta(s) concluída(s)';
};

const metasRealizadas = async () => {
    const realizadas = metas.filter((meta) => meta.checked);

    if (realizadas.length == 0) {
        mensagem = 'Não existem metas realizadas! :(';
        return;
    }

    await select({
        message: "Metas realizadas: " + realizadas.length,
        choices: realizadas.map(meta => ({ name: meta.value, value: meta.value }))
    });

    mensagem = realizadas.length + " meta(s) realizadas";
};

const metasAbertas = async () => {
    const abertas = metas.filter((meta) => !meta.checked);

    if (abertas.length == 0) {
        mensagem = "Não existem metas abertas :)";
        return;
    }

    await select({
        message: "Metas Abertas: " + abertas.length,
        choices: abertas.map(meta => ({ name: meta.value, value: meta.value }))
    });

    mensagem = abertas.length + " meta(s) abertas";
};

const itensADeletar = async () => {
    if (metas.length == 0) {
        mensagem = "Não há metas para deletar!";
        return;
    }

    const respostas = await checkbox({
        message: "Selecione item para deletar",
        choices: metas.map(meta => ({ name: meta.value, value: meta.value })),
        instructions: false,
    });

    if (respostas.length == 0) {
        mensagem = "Nenhum item selecionado para deletar!";
        return;
    }

    metas = metas.filter(meta => !respostas.includes(meta.value));

    mensagem = "Meta(s) deletada(s) com sucesso!";
};

const mostrarMensagem = () => {
    if (mensagem !== "") {
        console.clear();
        console.log(mensagem);
        console.log("");
        mensagem = "";
    }
};

const start = async () => {
    await carregarMetas();

    while (true) {
        mostrarMensagem();
        await salvarMetas();

        const opcao = await select({
            message: "Menu >",
            choices: [
                { name: "Cadastrar meta", value: "cadastrar" },
                { name: "Listar metas", value: "listar" },
                { name: "Metas realizadas", value: "realizadas" },
                { name: "Deletar metas", value: "deletar" },
                { name: "Metas abertas", value: "abertas" },
                { name: "Sair", value: "sair" }
            ]
        });

        switch (opcao) {
            case "cadastrar":
                await cadastrarMeta();
                break;
            case "listar":
                await listarMetas();
                break;
            case "realizadas":
                await metasRealizadas();
                break;
            case "abertas":
                await metasAbertas();
                break;
            case "deletar":
                await itensADeletar();
                break;
            case "sair":
                console.log("Até a próxima!");
                return;
        }
    }
};

start();