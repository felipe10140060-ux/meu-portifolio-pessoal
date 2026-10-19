/* =========================================================
   FELIPE ARGOLO - PORTFÓLIO
   JAVASCRIPT + SUPABASE
========================================================= */


/* =========================================================
   1. CONFIGURAÇÃO DO SUPABASE
========================================================= */

const SUPABASE_URL =
    "https://ueerkkknhoaiyhittvgr.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_2y940pE5JeYijUBIf6KSkA_hSxciBwT";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);


/* =========================================================
   2. ELEMENTOS DO SITE
========================================================= */

const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

const userBtn = document.getElementById("userBtn");
const userBtnText = document.getElementById("userBtnText");

const userModal = document.getElementById("userModal");
const userModalOverlay =
    document.getElementById("userModalOverlay");

const userModalClose =
    document.getElementById("userModalClose");


/* =========================================================
   3. MENU MOBILE
========================================================= */

if (menuBtn && nav) {

    menuBtn.addEventListener("click", () => {

        nav.classList.toggle("open");

        menuBtn.classList.toggle("active");

    });


    document.querySelectorAll(".nav-link").forEach(link => {

        link.addEventListener("click", () => {

            nav.classList.remove("open");

            menuBtn.classList.remove("active");

        });

    });

}


/* =========================================================
   4. MODAL DO USUÁRIO
========================================================= */

function abrirModalUsuario() {

    if (!userModal) return;

    userModal.classList.add("open");

    userModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add("modal-open");

}


function fecharModalUsuario() {

    if (!userModal) return;

    userModal.classList.remove("open");

    userModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove("modal-open");

}


if (userBtn) {

    userBtn.addEventListener(
        "click",
        abrirModalUsuario
    );

}


if (userModalClose) {

    userModalClose.addEventListener(
        "click",
        fecharModalUsuario
    );

}


if (userModalOverlay) {

    userModalOverlay.addEventListener(
        "click",
        fecharModalUsuario
    );

}


document.addEventListener("keydown", event => {

    if (
        event.key === "Escape" &&
        userModal &&
        userModal.classList.contains("open")
    ) {

        fecharModalUsuario();

    }

});


/* =========================================================
   5. ELEMENTOS DE AUTENTICAÇÃO
========================================================= */

const authGuest =
    document.getElementById("authGuest");

const authLogged =
    document.getElementById("authLogged");

const authForm =
    document.getElementById("authForm");

const authName =
    document.getElementById("authName");

const authEmail =
    document.getElementById("authEmail");

const authPassword =
    document.getElementById("authPassword");

const authNameGroup =
    document.getElementById("authNameGroup");

const authSubmit =
    document.getElementById("authSubmit");

const authSwitch =
    document.getElementById("authSwitch");

const authStatus =
    document.getElementById("authStatus");

const loggedUserName =
    document.getElementById("loggedUserName");

const loggedUserEmail =
    document.getElementById("loggedUserEmail");

const logoutBtn =
    document.getElementById("logoutBtn");


let modoCadastro = true;


/* =========================================================
   6. MENSAGENS
========================================================= */

function mostrarAuthMensagem(
    mensagem,
    tipo = "normal"
) {

    if (!authStatus) return;

    authStatus.textContent = mensagem;

    authStatus.className =
        "form-status " + tipo;

}


function limparAuthMensagem() {

    if (!authStatus) return;

    authStatus.textContent = "";

}


/* =========================================================
   7. ALTERNAR LOGIN / CADASTRO
========================================================= */

function atualizarModoAuth() {

    if (!authNameGroup) return;

    if (modoCadastro) {

        authNameGroup.style.display = "block";

        authSubmit.textContent =
            "Criar conta";

        authSwitch.textContent =
            "Já tenho uma conta";

        if (authPassword) {

            authPassword.autocomplete =
                "new-password";

        }

    } else {

        authNameGroup.style.display = "none";

        authSubmit.textContent =
            "Entrar";

        authSwitch.textContent =
            "Ainda não tenho uma conta";

        if (authPassword) {

            authPassword.autocomplete =
                "current-password";

        }

    }

    limparAuthMensagem();

}


if (authSwitch) {

    authSwitch.addEventListener(
        "click",
        () => {

            modoCadastro =
                !modoCadastro;

            atualizarModoAuth();

        }
    );

}


/* =========================================================
   8. ATUALIZAR ÁREA DO USUÁRIO
========================================================= */

async function atualizarAreaUsuario() {

    const {
        data,
        error
    } = await supabaseClient.auth.getSession();


    if (error) {

        console.error(
            "Erro ao verificar sessão:",
            error
        );

        mostrarUsuarioDeslogado();

        return;

    }


    const session = data?.session;

    if (session?.user) {

        mostrarUsuarioLogado(
            session.user
        );

    } else {

        mostrarUsuarioDeslogado();

    }

}


/* =========================================================
   9. MOSTRAR USUÁRIO LOGADO
========================================================= */

function mostrarUsuarioLogado(user) {

    if (authGuest) {

        authGuest.hidden = true;

    }


    if (authLogged) {

        authLogged.hidden = false;

    }


    const nome =
        user.user_metadata?.nome ||
        user.email?.split("@")[0] ||
        "Usuário";


    if (loggedUserName) {

        loggedUserName.textContent =
            `Olá, ${nome}!`;

    }


    if (loggedUserEmail) {

        loggedUserEmail.textContent =
            user.email || "";

    }


    if (userBtnText) {

        userBtnText.textContent =
            nome;

    }

}


/* =========================================================
   10. MOSTRAR USUÁRIO DESLOGADO
========================================================= */

function mostrarUsuarioDeslogado() {

    if (authGuest) {

        authGuest.hidden = false;

    }


    if (authLogged) {

        authLogged.hidden = true;

    }


    if (userBtnText) {

        userBtnText.textContent =
            "Entrar";

    }


    if (authForm) {

        authForm.reset();

    }


    modoCadastro = true;

    atualizarModoAuth();

}


/* =========================================================
   11. CADASTRO / LOGIN
========================================================= */

if (authForm) {

    authForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            limparAuthMensagem();


            const email =
                authEmail.value.trim();

            const password =
                authPassword.value;


            if (!email || !password) {

                mostrarAuthMensagem(
                    "Preencha e-mail e senha.",
                    "error"
                );

                return;

            }


            if (password.length < 6) {

                mostrarAuthMensagem(
                    "A senha precisa ter pelo menos 6 caracteres.",
                    "error"
                );

                return;

            }


            authSubmit.disabled = true;

            authSubmit.textContent =
                modoCadastro
                    ? "Criando conta..."
                    : "Entrando...";


            try {

                /* =====================
                   CADASTRO
                ===================== */

                if (modoCadastro) {

                    const nome =
                        authName.value.trim();


                    if (!nome) {

                        throw new Error(
                            "Digite seu nome."
                        );

                    }


                    const {
                        data,
                        error
                    } =
                        await supabaseClient.auth.signUp({

                            email: email,

                            password: password,

                            options: {

                                data: {
                                    nome: nome
                                },

                                emailRedirectTo:
                                    window.location.origin

                            }

                        });


                    if (error) {

                        throw error;

                    }


                    /*
                      Se o Supabase estiver com
                      confirmação de e-mail ativada,
                      a sessão pode vir vazia.
                    */

                    if (
                        data?.user &&
                        !data?.session
                    ) {

                        mostrarAuthMensagem(
                            "Conta criada! Verifique seu e-mail para confirmar o cadastro.",
                            "success"
                        );

                    } else {

                        mostrarAuthMensagem(
                            "Conta criada com sucesso!",
                            "success"
                        );

                        setTimeout(
                            fecharModalUsuario,
                            1000
                        );

                    }

                }


                /* =====================
                   LOGIN
                ===================== */

                else {

                    const {
                        data,
                        error
                    } =
                        await supabaseClient.auth
                            .signInWithPassword({

                                email: email,

                                password: password

                            });


                    if (error) {

                        throw error;

                    }


                    if (data?.user) {

                        mostrarAuthMensagem(
                            "Login realizado com sucesso!",
                            "success"
                        );


                        mostrarUsuarioLogado(
                            data.user
                        );


                        setTimeout(
                            fecharModalUsuario,
                            800
                        );

                    }

                }


            } catch (error) {

                console.error(
                    "Erro de autenticação:",
                    error
                );


                mostrarAuthMensagem(
                    traduzirErroAuth(
                        error.message
                    ),
                    "error"
                );

            } finally {

                authSubmit.disabled = false;

                authSubmit.textContent =
                    modoCadastro
                        ? "Criar conta"
                        : "Entrar";

            }

        }
    );

}


/* =========================================================
   12. TRADUZIR ERROS DO SUPABASE
========================================================= */

function traduzirErroAuth(mensagem) {

    const texto =
        String(mensagem || "").toLowerCase();


    if (
        texto.includes("invalid login credentials")
    ) {

        return "E-mail ou senha incorretos.";

    }


    if (
        texto.includes("email not confirmed")
    ) {

        return "Confirme seu e-mail antes de entrar.";

    }


    if (
        texto.includes("user already registered")
    ) {

        return "Este e-mail já possui uma conta.";

    }


    if (
        texto.includes("password should be at least")
    ) {

        return "A senha precisa ter pelo menos 6 caracteres.";

    }


    if (
        texto.includes("invalid email")
    ) {

        return "Digite um e-mail válido.";

    }


    return mensagem ||
        "Não foi possível realizar a operação.";

}


/* =========================================================
   13. LOGOUT
========================================================= */

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async () => {

            logoutBtn.disabled = true;

            logoutBtn.textContent =
                "Saindo...";


            const {
                error
            } =
                await supabaseClient.auth.signOut();


            if (error) {

                console.error(
                    "Erro ao sair:",
                    error
                );

                mostrarAuthMensagem(
                    "Não foi possível sair da conta.",
                    "error"
                );

                logoutBtn.disabled = false;

                logoutBtn.textContent =
                    "Sair da conta";

                return;

            }


            mostrarUsuarioDeslogado();

            fecharModalUsuario();

            logoutBtn.disabled = false;

            logoutBtn.textContent =
                "Sair da conta";

        }
    );

}


/* =========================================================
   14. OBSERVAR ALTERAÇÕES DE LOGIN
========================================================= */

supabaseClient.auth.onAuthStateChange(
    (event, session) => {

        console.log(
            "Auth:",
            event
        );


        if (session?.user) {

            mostrarUsuarioLogado(
                session.user
            );

        } else {

            mostrarUsuarioDeslogado();

        }

    }
);


/* =========================================================
   15. FORMATAÇÃO DO TELEFONE
========================================================= */

const telefoneInput =
    document.getElementById("telefone");


function formatarTelefone(valor) {

    let numeros =
        valor.replace(/\D/g, "");

    numeros =
        numeros.substring(0, 11);


    if (numeros.length <= 2) {

        return numeros;

    }


    if (numeros.length <= 6) {

        return numeros.replace(
            /^(\d{2})(\d+)/,
            "($1) $2"
        );

    }


    if (numeros.length <= 10) {

        return numeros.replace(
            /^(\d{2})(\d{4})(\d+)/,
            "($1) $2-$3"
        );

    }


    return numeros.replace(
        /^(\d{2})(\d{5})(\d{4})$/,
        "($1) $2-$3"
    );

}


if (telefoneInput) {

    telefoneInput.addEventListener(
        "input",
        event => {

            event.target.value =
                formatarTelefone(
                    event.target.value
                );

        }
    );

}


/* =========================================================
   16. FORMULÁRIO DE CONTATO
========================================================= */

const leadForm =
    document.getElementById("leadForm");

const btnText =
    document.getElementById("btnText");

const btnLoading =
    document.getElementById("btnLoading");

const mensagemStatus =
    document.getElementById("mensagemStatus");


function mostrarStatusContato(
    mensagem,
    tipo = "normal"
) {

    if (!mensagemStatus) return;

    mensagemStatus.textContent =
        mensagem;

    mensagemStatus.className =
        "form-status " + tipo;

}


if (leadForm) {

    leadForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const nome =
                document
                    .getElementById("nome")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();


            const telefone =
                document
                    .getElementById("telefone")
                    .value
                    .trim();


            const mensagem =
                document
                    .getElementById("mensagem")
                    .value
                    .trim();


            /* =====================
               VALIDAÇÕES
            ===================== */

            if (!nome) {

                mostrarStatusContato(
                    "Digite seu nome.",
                    "error"
                );

                return;

            }


            if (!email) {

                mostrarStatusContato(
                    "Digite seu e-mail.",
                    "error"
                );

                return;

            }


            const telefoneNumeros =
                telefone.replace(
                    /\D/g,
                    ""
                );


            if (
                telefoneNumeros.length < 10 ||
                telefoneNumeros.length > 11
            ) {

                mostrarStatusContato(
                    "Digite um telefone válido.",
                    "error"
                );

                return;

            }


            if (!mensagem) {

                mostrarStatusContato(
                    "Digite sua mensagem.",
                    "error"
                );

                return;

            }


            /* =====================
               ESTADO DO BOTÃO
            ===================== */

            const submitButton =
                leadForm.querySelector(
                    'button[type="submit"]'
                );


            if (submitButton) {

                submitButton.disabled = true;

            }


            if (btnText) {

                btnText.style.display =
                    "none";

            }


            if (btnLoading) {

                btnLoading.style.display =
                    "inline";

            }


            mostrarStatusContato(
                "Enviando mensagem..."
            );


            try {

                /* =====================
                   PEGAR USUÁRIO ATUAL
                ===================== */

                const {
                    data: sessionData
                } =
                    await supabaseClient.auth
                        .getSession();


                const user =
                    sessionData?.session?.user ||
                    null;


                const userId =
                    user?.id || null;


                /* =====================
                   ENVIAR PARA LEADS
                ===================== */

                const {
                    error
                } =
                    await supabaseClient
                        .from("leads")
                        .insert({

                            nome: nome,

                            email: email,

                            telefone: telefone,

                            mensagem: mensagem,

                            user_id: userId

                        });


                if (error) {

                    throw error;

                }


                /* =====================
                   SUCESSO
                ===================== */

                mostrarStatusContato(
                    "Mensagem enviada com sucesso!",
                    "success"
                );


                leadForm.reset();


                /* =====================
                   LIMPAR MENSAGEM
                ===================== */

                setTimeout(
                    () => {

                        if (
                            mensagemStatus
                        ) {

                            mensagemStatus.textContent =
                                "";

                        }

                    },
                    5000
                );


            } catch (error) {

                console.error(
                    "Erro ao enviar lead:",
                    error
                );


                mostrarStatusContato(
                    "Não foi possível enviar. Verifique a configuração do Supabase.",
                    "error"
                );

            } finally {

                if (submitButton) {

                    submitButton.disabled =
                        false;

                }


                if (btnText) {

                    btnText.style.display =
                        "inline";

                }


                if (btnLoading) {

                    btnLoading.style.display =
                        "none";

                }

            }

        }
    );

}


/* =========================================================
   17. CARREGAR PROJETOS DO SUPABASE
========================================================= */

async function carregarProjetos() {

    const lista =
        document.getElementById(
            "listaProjetos"
        );


    if (!lista) return;


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("projetos")
                .select("*")
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );


        if (error) {

            throw error;

        }


        if (!data || data.length === 0) {

            lista.innerHTML = `

                <div class="empty-projects">

                    <h3>
                        Ainda não há projetos cadastrados.
                    </h3>

                    <p>
                        Os projetos adicionados ao Supabase
                        aparecerão aqui automaticamente.
                    </p>

                </div>

            `;

            return;

        }


        lista.innerHTML =
            data.map(
                projeto => {

                    const titulo =
                        escaparHTML(
                            projeto.titulo ||
                            projeto.nome ||
                            "Projeto"
                        );


                    const descricao =
                        escaparHTML(
                            projeto.descricao ||
                            "Projeto desenvolvido por Felipe."
                        );


                    const tecnologia =
                        escaparHTML(
                            projeto.tecnologia ||
                            projeto.categoria ||
                            "Tecnologia"
                        );


                    const link =
                        projeto.link ||
                        projeto.url ||
                        "#";


                    return `

                        <article class="project-card">

                            <div class="project-number">
                                ${String(
                                    data.indexOf(projeto) + 1
                                ).padStart(2, "0")}
                            </div>

                            <span class="project-category">
                                ${tecnologia}
                            </span>

                            <h3>
                                ${titulo}
                            </h3>

                            <p>
                                ${descricao}
                            </p>

                            ${
                                link !== "#"
                                ? `
                                    <a
                                        href="${escaparAtributo(link)}"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="project-link"
                                    >
                                        Ver projeto →
                                    </a>
                                `
                                : ""
                            }

                        </article>

                    `;

                }
            ).join("");


    } catch (error) {

        console.error(
            "Erro ao carregar projetos:",
            error
        );


        lista.innerHTML = `

            <div class="empty-projects">

                <h3>
                    Projetos
                </h3>

                <p>
                    Não foi possível carregar os projetos
                    neste momento.
                </p>

            </div>

        `;

    }

}


/* =========================================================
   18. SEGURANÇA BÁSICA PARA TEXTO DO BANCO
========================================================= */

function escaparHTML(valor) {

    return String(valor)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


function escaparAtributo(valor) {

    return escaparHTML(valor);

}


/* =========================================================
   19. VOLTAR AO TOPO
========================================================= */

const backTop =
    document.getElementById(
        "backTop"
    );


window.addEventListener(
    "scroll",
    () => {

        if (!backTop) return;


        if (window.scrollY > 500) {

            backTop.classList.add(
                "show"
            );

        } else {

            backTop.classList.remove(
                "show"
            );

        }

    }
);


if (backTop) {

    backTop.addEventListener(
        "click",
        () => {

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }
    );

}


/* =========================================================
   20. ANIMAÇÃO AO ENTRAR NA TELA
========================================================= */

const observer =
    new IntersectionObserver(
        entries => {

            entries.forEach(
                entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "visible"
                        );

                    }

                }
            );

        },
        {
            threshold: 0.12
        }
    );


document
    .querySelectorAll(
        ".skill-card, .project-card, .timeline-item, .stat"
    )
    .forEach(
        element => {

            observer.observe(
                element
            );

        }
    );


/* =========================================================
   21. NAVEGAÇÃO ATIVA
========================================================= */

const sections =
    document.querySelectorAll(
        "section[id]"
    );


const navigationLinks =
    document.querySelectorAll(
        ".nav-link"
    );


const sectionObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(
                entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        const id =
                            entry.target.id;


                        navigationLinks
                            .forEach(
                                link => {

                                    link.classList.toggle(
                                        "active",
                                        link.getAttribute(
                                            "href"
                                        ) === `#${id}`
                                    );

                                }
                            );

                    }

                }
            );

        },
        {
            rootMargin:
                "-30% 0px -60% 0px"
        }
    );


sections.forEach(
    section => {

        sectionObserver.observe(
            section
        );

    }
);


/* =========================================================
   22. INICIALIZAÇÃO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        atualizarModoAuth();

        await atualizarAreaUsuario();

        await carregarProjetos();

    }
);