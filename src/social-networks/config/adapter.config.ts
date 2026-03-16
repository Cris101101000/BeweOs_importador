import type { IPostsPort } from "../domain/ports/posts.port";
import { postsAdapter } from "../infrastructure/adapters/posts.adapter";

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║           CONFIGURACIÓN DE ADAPTADOR DE POSTS                    ║
 * ║                                                                  ║
 * ║  El adaptador PostsAdapter ahora maneja internamente si usa     ║
 * ║  MOCK o API REAL. Para cambiar, edita el archivo:              ║
 * ║                                                                  ║
 * ║  infrastructure/adapters/posts.adapter.ts                       ║
 * ║                                                                  ║
 * ║  y comenta/descomenta las secciones "MOCK" o "BACKEND"         ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

/**
 * Adaptador configurado para posts
 *
 * Este adaptador puede usar MOCK o API REAL internamente.
 * Ver posts.adapter.ts para cambiar entre ellos.
 */
export const configuredPostsAdapter: IPostsPort = postsAdapter;
