# ✨ GlassEffect — Gerador de Glassmorphism CSS
![Status](https://img.shields.io/badge/Status-Conclu%C3%ADdo-brightgreen)
![Tipo](https://img.shields.io/badge/Tipo-Front--end-blue)
![Stack](https://img.shields.io/badge/Stack-HTML%20%7C%20CSS%20%7C%20JavaScript-6A5ACD)
![Estilo](https://img.shields.io/badge/UI-Glassmorphism-38BDF8)
![Monetiza%C3%A7%C3%A3o](https://img.shields.io/badge/AdSense-Ready-FFB300)

Ferramenta front-end para criar, visualizar e exportar estilos de **glassmorphism** com preview em tempo real. O projeto foi pensado para acelerar o processo de design de cartões translúcidos com efeito de vidro fosco, mantendo foco em legibilidade, SEO e estrutura pronta para monetização.

---

# 🎯 Objetivo do Projeto

Entregar uma utility page prática para designers e devs que precisam gerar CSS de vidro fosco sem perder tempo em tentativa e erro manual.

A aplicação permite ajustar:
- Transparência do cartão
- Intensidade de desfoque (`blur`)
- Saturação do fundo
- Espessura da borda
- Cor base em HEX ou RGBA
- Fundo de teste (gradiente, cor sólida ou imagem)

Foco em:
- **Produtividade**: ajustes visuais instantâneos com snippet pronto para copiar.
- **Qualidade visual**: comparação rápida em diferentes fundos para validar contraste.
- **Monetização futura**: áreas de anúncio já separadas para integração com AdSense.

---

# 🧠 Estratégia e Arquitetura

O projeto segue uma arquitetura enxuta de página única (single-page utility), com responsabilidades bem divididas:

1. **Estrutura (index.html)**
   - Layout principal, blocos de controle, preview, área de código e slots de anúncio.
   - Meta tags de SEO e Open Graph para indexação e compartilhamento.

2. **Estilo (styles.css)**
   - Estética glassmorphism, componentes visuais e refinamento da experiência.
   - Complementa classes utilitárias do Tailwind com regras específicas do projeto.

3. **Lógica (script.js)**
   - Atualização em tempo real do preview conforme os controles.
   - Geração do CSS final com compatibilidade de propriedades.
   - Função de cópia para clipboard.

4. **UI Utilities (CDN)**
   - **TailwindCSS (CDN)** para utilitários rápidos de layout e responsividade.
   - **Lucide Icons** para ícones leves e consistentes.

---

# 🔄 Funcionalidades

1. **Controles dinâmicos de efeito**
   - Sliders para opacidade, blur, saturação e borda.
   - Inputs de cor com suporte visual e textual (HEX/RGBA).

2. **Preview em tempo real**
   - Cartão de vidro atualizado continuamente.
   - Feedback instantâneo para validar estética e legibilidade.

3. **Simulação de fundo**
   - Alternância entre gradiente, cor sólida e imagem temática.
   - Ajuste de ângulo e cores de gradiente para cenários variados.

4. **Geração de CSS pronta para uso**
   - Área de código com snippet final do efeito.
   - Botão para copiar o CSS com rapidez.

5. **SEO e compartilhamento**
   - Título, descrição, keywords e Open Graph definidos no HTML.

6. **Slots de monetização preparados**
   - Espaços de anúncio no topo, lateral e rodapé já posicionados.
   - Estrutura pronta para ativação com Google AdSense.

---

# 📁 Estrutura do Projeto

```
GlassEffect/
  index.html      # Estrutura da página, controles, preview, SEO e slots de anúncio
  styles.css      # Estilos visuais, glassmorphism e acabamento da interface
  script.js       # Lógica de interação, atualização do preview e geração de CSS
  README.md       # Documentação do projeto
```

---

# 🛠️ Tecnologias

- **HTML5**: marcação semântica da aplicação.
- **CSS3**: estilos customizados e acabamento visual.
- **JavaScript (Vanilla)**: interatividade e regras de geração do snippet.
- **TailwindCSS (CDN)**: utilitários de layout e responsividade.
- **Lucide Icons**: iconografia da interface.

---

# 📈 SEO e Monetização

O projeto já nasce com base para crescimento orgânico e monetização:

- Meta tags para indexação (`description`, `keywords`, `robots`).
- Open Graph para melhor prévia em redes sociais.
- Layout com áreas dedicadas para anúncios sem quebrar a experiência principal.

---

# ▶️ Como Executar

1) Clone ou baixe os arquivos do projeto.

2) Abra a pasta do projeto:
```bash
cd GlassEffect
```

3) Execute com servidor local (recomendado):
```bash
# Exemplo com Python
python -m http.server 5500
```

4) Acesse no navegador:
```text
http://localhost:5500
```

Também é possível abrir o `index.html` diretamente, mas o servidor local é preferível para comportamento consistente entre ambientes.

---

# 🧪 Validação Manual Recomendada

- Ajustar cada slider e conferir atualização imediata no preview.
- Trocar entre os 3 tipos de fundo e verificar legibilidade do cartão.
- Testar entrada de cor em HEX e RGBA.
- Copiar o CSS e aplicar em um componente externo para validar portabilidade.

---

# 🤝 Conclusão

O GlassEffect entrega uma base sólida para criação de efeito vidro fosco com agilidade: interface clara, preview em tempo real, snippet copiável e estrutura pronta para SEO + monetização. É uma ferramenta direta, prática e preparada para evoluir com novos presets e variações visuais.
