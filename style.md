# One Piece Cat — Guía de estilo

> Este archivo es la fuente de verdad del sistema visual de `web/`. **Actualízalo
> siempre que edites layout o estilo**: nuevo token, nuevo componente, cambio de
> tipografía, nueva página, etc. Si un cambio de CSS no encaja en ninguna
> sección de abajo, añade una sección nueva antes de mergear.

## 0. Idioma

**Tot el text visible de la web és sempre en català.** Sense excepcions:
títols, botons, placeholders, missatges d'error, `aria-label`, `<html lang>`
(`ca`) i rutes (`/`, `/capitols`). Els noms de saga vénen de `episodes.json`
i ja estan en català; si algun dia s'afegeix contingut nou a l'API, ha
d'entrar també en català. Qualsevol text nou en un component ha d'escriure's
directament en català — no traduir "després".

## 0.1 Atribució de la font de vídeo

**Els vídeos NO són propis: es serveixen des de `https://onepiece.xarxacatala.cat/`.**
Aquest crèdit ha d'aparèixer sempre, de manera visible i com a enllaç clicable,
com a mínim a:
- El modal de Crèdits de la Landing (`.credits-modal`, obert des del botó
  "Crèdits" a `.hero-flags` dins `ParallaxHero.jsx`).
- La barra lateral de Capítols (`.source-credit`, `src/pages/Chapters.jsx`).

Si s'afegeix una pàgina o vista nova que mostri episodis/vídeos, ha d'incloure
el mateix crèdit amb enllaç a `onepiece.xarxacatala.cat`. No eliminar ni
amagar aquesta atribució en cap refactor de layout.

## 1. Dirección de arte

Tema: archivo pirata/anime, con mapas de tesoro y carteles de "se busca" como
firma visual. El hero de la Landing usa 4 ilustraciones reales del Going Merry
proporcionadas por el propietario del proyecto (`web/public/parallax/`). El
navbar usa el logo real del propietario (`web/public/brand/one_piece_catala_logo.png`).
Uso de todo este material es responsabilidad del propietario, no de este
equipo de estilo. El resto de la ambientación (tarjetas de saga y episodio)
sigue siendo SVG/CSS propio, sin arte con copyright de terceros.
`LogPose.jsx` existe como componente SVG (brújula animada) pero no está
montado en ninguna vista actualmente.

Un solo riesgo estético por página: en Landing es el hero parallax de varias
capas + Log Pose animado. En Capítulos es el grid de episodios estilo cartel
de recompensa (borde punteado tipo papel, número de saga en `Bangers`). No
añadir más de un elemento "hero" por vista.

## 2. Tokens de color (`src/index.css`)

| Token | Hex | Uso |
|---|---|---|
| `--op-navy` | `#071427` | Fondo base (cielo nocturno / mar profundo) |
| `--op-navy-2` | `#0d2038` | Superficies elevadas (sidebar, cards, navbar-blur) |
| `--op-navy-3` | `#142c4c` | Superficies secundarias / gradientes de barco e isla |
| `--op-gold` | `#e8b23d` | Marca, acentos, bordes activos, texto de foco |
| `--op-gold-dim` | `#a87a1f` | Bordes/detalles del sombrero, scrollbar |
| `--op-red` | `#c1272d` | CTA principal, error, acentos de peligro |
| `--op-red-dim` | `#7c1a1e` | Variante oscura de rojo (hover/disabled) |
| `--op-parchment` | `#f4e8c9` | Texto principal sobre fondo oscuro |
| `--op-parchment-dim` | `#d8c79f` | Texto secundario / subtítulos |
| `--op-teal` | `#1f7a6c` | Mar medio, acentos de disponibilidad local |
| `--op-ink` | `#1a1310` | Texto oscuro sobre superficies claras (selección) |
| `--op-border` | `rgba(232,178,61,.28)` | Bordes sutiles dorados |
| `--op-cream` | `#ede4c8` | Trim/marfil del casco (bordes gruesos estilo Going Merry, texto sobre placas doradas) |
| `--op-wood` | `#4a2e18` | Madera oscura del casco (fondos de placa, sombras cálidas) |
| `--op-wood-light` | `#6b4226` | Madera clara (degradados de placa/casco) |
| `--op-outline` | `#050d18` | Línea de tinta gruesa tipo cel-shading (contorno de tarjetas/placas) |
| `--op-poster-paper` | `#fdf6e2` | Fondo pergamino de las tarjetas "Wanted" de episodio |
| `--op-poster-paper-dim` | `#f0e4c4` | Doble borde interior de las tarjetas "Wanted" |

No introducir colores nuevos sueltos en componentes: si hace falta un tono
nuevo, añádelo aquí primero con nombre semántico.

## 3. Tipografía

| Rol | Fuente | Variable | Dónde |
|---|---|---|---|
| Display (títulos grandes) | `Pirata One` | `--font-display` | H1 del hero, títulos de sección, marca del navbar |
| Acento (cómic/anime, números, botones) | `Bangers` | `--font-accent` | CTA, badges de saga, número de episodio, cabecera del reproductor |
| Cuerpo / UI | `Poppins` | `--font-body` | Párrafos, inputs, navegación, texto de episodios |

Cargadas vía Google Fonts en `index.html`. No usar más de estas 3 familias.
`Pirata One` solo en títulos grandes (nunca en párrafos: es blackletter, se
lee mal en texto largo).

## 4. Layout por página

### Landing (`/`, `src/pages/Landing.jsx` + `styles/landing.css`)
- **Hero** (`ParallaxHero.jsx`): 100vh, 4 capas de ilustración real servidas
  desde `public/parallax/` (no procesadas por Vite, se referencian como
  `/parallax/*.svg`):
  1. `sky.svg` — cielo diurno (raster JPEG embebido), capa base opaca.
  2. `clouds.svg` — banco de nubes, ocupa el 76.5% superior (`881/1152`,
     misma proporción que el export original respecto al lienzo de 1152px).
  3. `birds.svg` — bandada, opaca (`opacity:1`, sin transparencia),
     posicionada a ojo (`top:28%; left:43%; right:27%`) porque el export
     perdió el offset original dentro del lienzo de 2112×1152; el ancho es
     un 30% del hero. Si se sustituye el asset, reajustar `top/left/right`
     a mano comprobando que no tapa el CTA.
  4. `going_marry.svg` — el Going Merry navegando, mismo lienzo 2112×1152
     que `sky.svg`; se superpone en `inset:0` para que el horizonte coincida
     exactamente con el de `clouds.svg`. **Siempre la capa más alta de las 4**
     (`z-index` por encima de sky/clouds/birds) — el barco tapa a los
     pájaros cuando se solapan, nunca al revés.
  Cada capa se mueve a `scrollY * factor` (0.04 → 0.35, de fondo a frente)
  vía refs + listener de scroll; respeta `prefers-reduced-motion`
  desactivando el listener. La deriva idle de `birds.svg` es una animación
  CSS en un wrapper interno (`.hero-birds-drift`), **nunca** en el mismo
  nodo que recibe el `transform` de scroll (se pisarían entre sí).
  Las capas responden a scroll y a movimiento de ratón (parallax dual),
  con `prefers-reduced-motion` desactivando ambos listeners.
  `.hero-fade` difumina el borde inferior del hero hacia `--op-navy`.
  El contenido del hero es `.hero-flags`: enlaces a "Veure One Piece en
  català" (`/capitols`), grupo de Telegram, Xarxa Catalana y un botón
  "Crèdits" que abre un modal (`.credits-modal-overlay`) con el disclaimer
  de fan-archive y la atribución a `onepiece.xarxacatala.cat`. No hay `h1`
  ni CTA de texto separados: los "flags" son el único bloque de contenido.
- **Sagas**: el carrusel de tarjetas por temporada (`groupBySeason` +
  `getSeasonImage`, enlace a `/capitols?season=N`) existe en el código de
  `Landing.jsx` pero está comentado (`{/* ... */}`) — no se renderiza
  actualmente. Si se reactiva, actualizar esta sección.
- **Footer**: no hay footer propio en Landing; el disclaimer/atribución vive
  ahora en el modal de Crèdits del hero (ver arriba), no en `.landing-footer`.

### Capítulos (`/capitols`, `src/pages/Chapters.jsx` + `styles/chapters.css`)
- Layout de dos columnas: `wanted-sidebar` (eyebrow "Registre de navegació",
  buscador con icono de lupa, contador, lista de temporadas con indicador
  de borde izquierdo dorado en el ítem activo) + `content` (banner de saga +
  grid de episodios).
- La temporada activa vive en la URL (`?season=N`, vía `useSearchParams`),
  así cualquier enlace a `/capitols?season=N` es un acceso directo
  compartible/bookmarkable.
- `.saga-banner`: cabecera de la columna de contenido con el nombre de la
  saga activa en `Pirata One` con contorno de tinta (`text-shadow`) (o el
  término de búsqueda si hay `query`), kicker en `Bangers` mayúsculas y
  contador de episodios; se remata con una línea ondulada (ola) en vez de
  un simple `border-bottom`. Es el único punto donde aparece el título de
  temporada grande; no duplicarlo en el sidebar.
- Dirección de arte "cel-shading" tomada del wallpaper oficial del Going
  Merry (`assets/full1_wallpaper.png`): contornos de tinta gruesos
  (`--op-outline`, 2-4px) en vez de bordes finos, superficies de madera
  (`--op-wood` / `--op-wood-light`) para el sidebar y sombras "duras"
  desplazadas (`box-shadow: Npx Npx 0 ...`) en vez de blur, imitando el
  trazo plano del anime. El sidebar es un panel de casco de madera; la
  temporada activa es una placa dorada sólida (no una tinta translúcida).
  Este lenguaje "cel-shading + madera + tinta" es el único riesgo estético
  de la página fuera de las tarjetas (ver sección 1).
- Tarjetas de episodio (`.wanted-card`): imitan un cartel de **"Se busca"**
  (Wanted Poster) de la Marina, no el lenguaje cel-shading del resto de la
  página — es una excepción deliberada y documentada, no mezclar los dos
  estilos dentro de la misma tarjeta.
  - Fondo pergamino `--op-poster-paper` (`#FDF6E2`), marco grueso de madera
    (`--op-wood`, 6px) con doble borde interior (`--op-poster-paper-dim` +
    `--op-outline`) y sombra dura desplazada que crece en `hover`.
    Token añadido en la sección 2: `--op-poster-paper` / `--op-poster-paper-dim`.
  - Cabecera `WANTED` (`--font-display`) / `DEAD OR ALIVE` (`--font-accent`,
    rojo) separada por un filete fino de tinta.
  - Miniatura 16:9 (`.wanted-thumb`, sin imagen real — no hay `thumbnail_url`
    en `episodes.json`, se usa un degradado de madera como placeholder) con
    badge rojo `EP. N` (esquina superior), badge verde `✓ Vist` (esquina
    inferior, solo si está marcado) y botón de play circular marfil que
    aparece con transición en `hover`/`focus-visible`.
  - Cuerpo: nombre de saga en rojo mayúsculas, título del episodio (resaltado
    en rojo al hover) y sinopsis a 2 líneas (`-webkit-line-clamp: 2`,
    generada por `synopsisForEpisode()` en `utils/episodes.js` — no hay
    sinopsis real en los datos, es texto de relleno determinista).
  - Pie: recompensa en Berries `฿` calculada con `bountyForEpisode()`
    (determinista a partir de `episode_absolute` + hash de `episode_id`,
    sin datos de recompensa reales) y dos botones circulares de acción:
    marcar como **Vist** (✓, persistido en `localStorage` bajo `opc_seen`)
    y **Favorit** (★, dorado al activarse, persistido bajo `opc_favs`).
- Reproductor: overlay modal a pantalla completa con blur de fondo, cabecera
  de madera, mismo lenguaje visual de contorno de tinta.

### Navbar (`src/components/Navbar.jsx` + `styles/navbar.css`)
Fijo arriba, fondo degradado que se disuelve hacia abajo (para no tapar el
hero), z-index 100. Marca: `public/brand/one_piece_catala_logo.png` (logo
único, ya incluye "One Piece Cat" en el propio asset — no hay `<span>` de
sufijo añadido en el navbar). Dos enlaces: Inici / Capítols. No añadir más
de 4-5 enlaces sin rediseñar a menú hamburguesa en mobile.

## 5. Componentes reutilizables (`src/components/`)

- `LogPose.jsx` — brújula pirata animada en SVG (existe, exportada, pero no
  montada actualmente en ninguna página). Si se reutiliza, hazlo como
  indicador de "más contenido abajo" o de carga, no como decoración suelta.
- `Navbar.jsx` — navegación global.
- `ParallaxHero.jsx` — solo para la Landing; si se necesita un hero en otra
  página, extraer una variante configurable en vez de duplicar el CSS.

## 6. Reglas al añadir/editar elementos

1. Todo color nuevo → añadir token en `index.css` + tabla de la sección 2.
2. Toda fuente nueva → justificar por qué las 3 actuales no bastan antes de
   añadir una cuarta.
3. Animaciones: deben respetar `prefers-reduced-motion` (ver bloque global en
   `index.css`). Si añades un `@keyframes` nuevo, verifica que quede cubierto
   por esa media query (lo está automáticamente si usas `animation`).
4. Fuera del hero de `assets/` (ver sección 1), toda ambientación nueva se
   hace en SVG/CSS propio, sin arte con copyright de terceros. Si se añaden
   más ilustraciones reales al proyecto, deben venir del propietario del
   repo, colocarse en `web/public/parallax/` (o una carpeta hermana) y
   documentarse aquí igual que el hero actual.
5. Un solo elemento "signature" por vista (ver sección 1). Si se te ocurre un
   segundo efecto llamativo para la misma página, quítalo o dale un hogar en
   otra página.
6. Después de cualquier cambio de layout/estilo: actualiza la sección
   correspondiente de este archivo en el mismo cambio (no en un commit
   aparte).
