# Especificação de Design: Sistema de Templates Multi-Produto & Configuração Avançada de Lentes

**Data:** 2026-09-28  
**Autor:** Antigravity (AI Senior Architect)  
**Status:** Aprovado para Implementação  
**Escopo:** Hub LP Studio, Templates de Landing Pages (/forlife, /visaosimples, /194), Roteamento Vercel e Sincronização CMS  

---

## 1. Contexto & Problema

Atualmente, o ecossistema de Landing Pages das Ópticas Conceição utiliza o template /forlife (específico para Lentes Multifocais Digitais Di Capri) como destino único para qualquer novo slug criado no Hub.

Isso gera uma inconsistência comercial grave para campanhas de Visão Simples, como a nova campanha 194 (Óculos Completo por R$ 194,00 em até 6x):
- O público-alvo de Visão Simples (miopia, astigmatismo, hipermetropia ou óculos de leitura/descanso) recebe textos sobre presbiopia, vista cansada e adaptação multifocal.
- Não há flexibilidade para alternar entre campanhas de "Óculos Completo" (armação inclusa) e campanhas de "Só Lentes" (troca de lentes na armação do cliente).
- Não há separação técnica entre Lentes Prontas (estoque econômico/rápido) e Lentes Surfaçadas (laboratório digital personalizado).
- As tecnologias adicionais (Antirreflexo, Filtro Azul, Fotossensível) aparecem de forma fixa, sem a possibilidade de desativar ou exibir em tom cinza atenuado quando não aplicáveis.
- Marcas de armação e marcas de lentes não podem ser especificadas livremente.

---

## 2. Requisitos do Sistema

### 2.1 Modalidades de Produtos e Lentes
O sistema deve suportar as seguintes combinações pré-configuradas:
1. **Tipo de Oferta:**
   - `combo_completo`: Óculos Completo (Armação de Grau inclusa + Lentes).
   - `so_lentes`: Apenas Lentes (Aproveitamento da armação atual do cliente ou venda avulsa).
2. **Modalidade das Lentes:**
   - `lentes_prontas`: Lentes Prontas (Estoque) - Foco em miopia/astigmatismo até faixas padrão, entrega rápida, preço imbatível (ideal para Campanha 194).
   - `visao_simples_surfacada`: Visão Simples Surfaçada Digital - Produção sob medida em laboratório para graus especiais, afinamento e personalização.
   - `multifocal`: Lentes Multifocais Digitais - Foco em presbiopia/vista cansada, amplo campo perto/longe e garantia de adaptação (ideal para ForLife / Varilux).

### 2.2 Controle de Tecnologias Adicionais
- Cada LP terá controle individual sobre quais tecnologias estão ativas:
  - Antirreflexo Premium
  - Filtro Azul (BlueCut)
  - Lentes Fotossensíveis
- Quando uma tecnologia estiver desativada:
  - O card da tecnologia é exibido com opacidade reduzida (cinza atenuado / `is-disabled-gray`), badge de "Não disponível nesta oferta" e fica não-selecionável pelo visitante.

### 2.3 Especificação de Marcas
- **Marca da Armação:** Campo customizável (ex: Coleção Conceição, Di Capri, FILA, Ray-Ban, ou "Armação do Cliente").
- **Marca / Laboratório das Lentes:** Campo customizável (ex: Di Capri HD, Varilux, Essilor, Crizal, Hoya, Lentes Conceição Express).

### 2.4 Painel Hub (LP Studio & CMS)
- O modal de criação/edição de LPs e a aba Configurações (CMS) receberão controles visuais intuitivos para gerenciar todas as opções acima.

### 2.5 Roteamento & Deploy no Vercel
- Rota /194 e /visaosimples servidas com o template de Visão Simples.
- Rota /forlife preservada para Multifocais.
