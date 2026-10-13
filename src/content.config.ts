import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "zod";

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug em kebab-case");

// Estudos de caso (spec 4.4): um arquivo .md por projeto.
const casos = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/casos" }),
  schema: z.object({
    titulo: z.string().min(1),
    slug,
    vinculo: z.string().min(1),
    periodo: z.string().optional(),
    resumo: z.string().min(1),
    tecnologias: z.array(z.string().min(1)),
    repos: z.array(z.string().min(1)),
    destaque: z.boolean(),
    ordem: z.number().int(),
    tese: slug.optional(),
  }),
});

// Pesquisa (spec 4.3): tese e dissertação com PDF comprimido.
const pesquisa = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pesquisa" }),
  schema: z.object({
    titulo: z.string().min(1),
    slug,
    resumo: z.string().min(1),
    pdf: z.object({
      href: z.string().regex(/^\/docs\/.+\.pdf$/),
      formato: z.literal("PDF"),
      tamanho: z.string().regex(/^\d+(?:[.,]\d+)? MB$/),
    }),
    repositorioUrl: z.string().url().optional(),
    publicacoesDerivadas: z
      .array(
        z.object({
          titulo: z.string().min(1),
          veiculo: z.string().optional(),
          ano: z.number().int().optional(),
          doi: z.string().optional(),
        }),
      )
      .default([]),
    midia: z
      .array(
        z.object({
          titulo: z.string().min(1),
          veiculo: z.string().min(1),
          url: z.string().url(),
        }),
      )
      .default([]),
  }),
});

// Páginas de dados estáticos em YAML (ex.: formação complementar).
const paginas = defineCollection({
  loader: glob({ pattern: "**/*.{yaml,yml}", base: "./src/content/paginas" }),
  schema: z.object({
    itens: z.array(
      z.object({
        titulo: z.string().min(1),
        instituicao: z.string().min(1),
        status: z.enum(["em-andamento", "concluido"]),
        ano_inicio: z.number().int().nullable(),
      }),
    ),
  }),
});

export const collections = { casos, pesquisa, paginas };
