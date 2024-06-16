# Gunakan image Node.js versi terbaru sebagai base image
FROM node:20

# Environment Variables
ENV PORT=8080
ENV FIREBASE_API_KEY="AIzaSyBOZYAGBqk7pIkk0ptpLxmrVjzBuphfExs"
ENV FIREBASE_AUTH_DOMAIN="skin-track-66f46.firebaseapp.com"
ENV FIREBASE_PROJECT_ID="skin-track-66f46"
ENV FIREBASE_STORAGE_BUCKET="skin-track-66f46.appspot.com"
ENV FIREBASE_MESSAGING_SENDER="604850615707"
ENV FIREBASE_APP_ID="1:604850615707:web:33a7ef47011a70b6865d3e"
ENV JWT_SECRET=qwertyPOIUnm.ASDF

# Set working directory di dalam kontainer
WORKDIR /usr/src/app

# Copy package.json dan package-lock.json (jika ada) dan install dependensi
COPY package*.json ./
RUN npm install

# Copy seluruh kode aplikasi
COPY . .

# Expose port yang digunakan oleh aplikasi
EXPOSE 8080

# Command untuk menjalankan aplikasi
CMD ["npm", "start"]
