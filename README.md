# AM & PM · Capítulo I

Web romántica e interactiva preparada para publicarse gratis con **GitHub Pages**.

## Archivos

- `index.html`: estructura y texto de la historia.
- `style.css`: diseño morado, animaciones y versión móvil.
- `script.js`: progreso de lectura, aparición de escenas, estrellas, corazones y sonido ambiental.
- `assets/heart.svg`: icono de la pestaña.

## Publicarla en GitHub Pages

1. Crea un repositorio nuevo en GitHub, por ejemplo `am-pm`.
2. Sube **todo el contenido de esta carpeta** a la raíz del repositorio.
3. Abre `Settings` → `Pages`.
4. En `Build and deployment`, selecciona `Deploy from a branch`.
5. Elige la rama `main` y la carpeta `/ (root)`.
6. Pulsa `Save`. GitHub mostrará la dirección pública cuando termine el despliegue.

Normalmente la URL tendrá este formato:

`https://TU-USUARIO.github.io/am-pm/`

## Personalización rápida

Busca en `index.html` esta frase final:

`Feliz primer mes, AM. Gracias por encontrarme al otro lado del mundo. 💜`

Puedes cambiarla por el mensaje que prefieras. El resto funciona sin instalar nada.

## Probarla en tu ordenador

Puedes abrir `index.html` directamente. Para una prueba idéntica a una web publicada, ejecuta dentro de la carpeta:

```bash
python -m http.server 8000
```

Y abre `http://localhost:8000`.
