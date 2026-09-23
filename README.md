# One Piece Cat — Web

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-6-CA4245?logo=reactrouter&logoColor=white)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)

Web per veure One Piece més còmodament en català, amb un mapa interactiu de l'aventura i seguiment d'episodis.

Els vídeos i l'idea original venen de **[Xarxa Catala](https://onepiece.xarxacatala.cat)**, la web que dobla/subtitula One Piece al català. Aquest projecte és un client extra a sobre del seu contingut.

## Requisits

- Node.js + npm
- Instal·lar dependències: `npm install`

## Executar (dev)

No hi ha servidor propi: les dades (`/data/episodes.json`) i els vídeos es
serveixen com a estàtics / des de `onepiece.xarxacatala.cat`. Només cal Vite:

```
npm run dev
```

Port per defecte 5173.

## Build producció

```
npm run build
npm run preview
```

`vercel.json` a l'arrel configura el desplegament a Vercel.
