# Backend uchun Dockerfile (Puppeteer bilan)

FROM node:20-slim

# Puppeteer uchun zarur bo'lgan tizim kutubxonalarini o'rnatish
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-ipafont-gothic \
    fonts-wqy-zenhei \
    fonts-thai-tlwg \
    fonts-kacst \
    fonts-freefont-ttf \
    libxss1 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Ishchi katalogni yaratish
WORKDIR /app

# Bog'liqliklarni nusxalash
COPY package*.json ./

# Faqat production bog'liqliklarni o'rnatish
RUN npm ci --omit=dev

# Ilova kodini nusxalash
COPY . .

# Puppeteer uchun Chromium yo'lini o'rnatish (env orqali)
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV CHROMIUM_PATH=/usr/bin/chromium

# Portni ochish
EXPOSE 5000

# Serverni ishga tushirish
CMD ["npm", "start"]
