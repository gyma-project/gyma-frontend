import React, { useState } from "react";

export default function Aluno() {
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <div style={styles.card}>
            {/* Cabeçalho do Cartão */}
            <div style={styles.cardHeader}>
                <div style={styles.usuario}>
                    <div style={styles.avatar}>K</div>
                    <div>
                        <div style={styles.title}>Keilany</div>
                    </div>
                </div>
                <div style={styles.editar}>
                    <button>
                        <img src="/icons/lapis.png" alt="Editar" style={{ width: 18, height: 18 }} />
                    </button>
                </div>

                <button style={{
                    ...styles.expandButton
                }}>
                    <img src="/icons/lixeira.png" alt="Excluir" style={{ width: 18, height: 18 }} />
                </button>
            </div>

            {/* Conteúdo */}
            <div style={styles.cardContent}>
                <p>
                    <b>E-mail:</b>keilanygabriel@gmail.com
                </p>
            </div>

            {/* Ações */}
            <div style={styles.cardActions}>
                <button
                    style={{
                        ...styles.expandButton,
                        transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                    onClick={handleExpandClick}>
                    <img src="/icons/olho.png" alt="Visualizar" style={{ width: 18, height: 18 }} />
                </button>
            </div>
            {/* Conteúdo Expandido */}
            {expanded && (
                <div style={styles.expandedContent}>
                    <p>
                        <b>Sobre o usuário:</b>
                    </p><br />
                    <p>
                        <b>Tipo de Usuário:</b>
                        <div style={{
                            backgroundColor: 'green', color: 'white', margin: "0 3px", padding: '5px 10px',
                            display: 'inline-block', borderRadius: '5px'
                        }}>
                            Aluno
                        </div>
                    </p>
                    <p>
                        <b>Data de Nascimento: </b>22/22/2222
                    </p>
                    <p>
                        <b>CPF: </b>111.111.111-11
                    </p>
                </div>
            )}
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    card: {
        maxWidth: "345px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
        fontFamily: "Arial, sans-serif",
        background: "#fff",
    },
    cardHeader: {
        display: "flex",
        alignItems: "center",
        padding: "16px",
        borderBottom: "1px solid #eee",
    },
    usuario: {
        display: "flex",
        alignItems: "center",
    },
    editar: {
        display: "flex",
        alignItems: "center",
        padding: "5px"
    },
    avatar: {
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        background: "#e74c3c",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        marginRight: "10px",
    },
    title: {
        fontSize: "16px",
        fontWeight: "bold",
    },
    cardContent: {
        padding: "16px",
        fontSize: "14px",
        color: "#333",
    },
    cardActions: {
        display: "flex",
        padding: "8px 16px",
        borderTop: "1px solid #eee",
    },
    expandButton: {
        background: "none",
        border: "none",
        fontSize: "20px",
        cursor: "pointer",
        marginLeft: "auto",
        transition: "transform 0.3s",
    },
    expandedContent: {
        padding: "16px",
        background: "#f9f9f9",
        fontSize: "14px",
        borderTop: "1px solid #eee",
    },
};
