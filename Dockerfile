# Use the official Node.js image
FROM node:20

# Install system dependencies (including Blender for USDZ → GLB conversion)
# RUN apt-get update && apt-get install -y \
#     libcairo2-dev \
#     libgif-dev \
#     libpango1.0-dev \
#     libjpeg-dev \
#     libpng-dev \
#     libpixman-1-dev \
#     python3 \
#     make \
#     g++ \
#     blender

# Install dependencies
RUN apt-get update && apt-get install -y \
    libcairo2-dev \
    libgif-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libpng-dev \
    libpixman-1-dev \
    python3 \
    make \
    g++ \
    wget \
    xz-utils \
    libgl1 \
    libxrender1 \
    libxext6 \
    libxi6 \
    libsm6 \
    libxrandr2 \
    libxcursor1 \
    libxinerama1 \
    libegl1 \
    libx11-6 \
    libxkbcommon0 \
    && rm -rf /var/lib/apt/lists/*

# Install Blender 4.3.2 manually
RUN wget https://download.blender.org/release/Blender4.3/blender-4.3.2-linux-x64.tar.xz && \
    tar -xf blender-4.3.2-linux-x64.tar.xz && \
    mv blender-4.3.2-linux-x64 /opt/blender && \
    ln -s /opt/blender/blender /usr/local/bin/blender

# Create app directory
WORKDIR /app

# Copy package files and install Node dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# If using ports (like Express)
EXPOSE 3000

# Default command to run your server
CMD ["node", "server.js"]