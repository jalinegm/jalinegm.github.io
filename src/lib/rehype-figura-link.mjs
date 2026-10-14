// Envolve cada <img> de <figure> em um link para o arquivo original.
// No celular, diagramas largos ficam pequenos; o link abre a imagem inteira para ampliar.
function visitar(no, fn) {
  if (!no.children) return;
  for (const filho of no.children) {
    fn(filho, no);
    visitar(filho, fn);
  }
}

export default function rehypeFiguraLink() {
  return (arvore) => {
    visitar(arvore, (no) => {
      if (no.type !== "element" || no.tagName !== "figure" || !no.children) return;
      no.children = no.children.map((filho) => {
        if (filho.type !== "element" || filho.tagName !== "img") return filho;
        return {
          type: "element",
          tagName: "a",
          properties: {
            href: filho.properties.src,
            className: ["figura-link"],
            target: "_blank",
            rel: ["noopener"],
            title: "Abrir imagem em tamanho original (nova aba)",
          },
          children: [filho],
        };
      });
    });
  };
}
