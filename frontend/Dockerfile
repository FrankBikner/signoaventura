# Usa una imagen ligera de Nginx para servir los archivos estáticos
FROM nginx:alpine

# Elimina la configuración por defecto de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia los archivos compilados de Angular a Nginx
COPY dist/SignoAventura_Web/browser /usr/share/nginx/html

# Copia una configuración personalizada de Nginx (opcional)
COPY nginx-custom.conf /etc/nginx/conf.d/default.conf

# Expone el puerto 80 (HTTP)
EXPOSE 80

# Inicia Nginx
CMD ["nginx", "-g", "daemon off;"]