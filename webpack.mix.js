const mix = require('laravel-mix');

mix.js('resources/js/app.tsx', 'public/build/assets/app.js')
   .react()
   .postCss('resources/css/app.css', 'public/build/assets/app.css')
   .setPublicPath('public/build');
