#!/bin/bash

# Install dependencies if needed
npm install

# Build the React app (for /app routes)
npm run build

# Ensure the wild-sky-9d31a9.webflow directory exists and has the correct permissions
sudo chown -R $USER:$USER wild-sky-9d31a9.webflow
sudo chmod -R 755 wild-sky-9d31a9.webflow

# Start/restart the application using PM2
pm2 stop vestige-frontend || true
pm2 delete vestige-frontend || true
pm2 start server.js --name vestige-frontend

# Configure Nginx for frontend with wildsky as default
sudo tee /etc/nginx/sites-available/vestige << EOF
server {
    listen 80;
    server_name getvestige.com www.getvestige.com;

    # Frontend location (wildsky marketing site)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;

        # Cache static assets
        location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg)$ {
            expires 1y;
            add_header Cache-Control "public, no-transform";
        }
    }

    # React app location
    location /app {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;

        # Handle React routing
        try_files \$uri \$uri/ /app/index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval';" always;
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/vestige /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Set up SSL with Certbot if not already set up
if [ ! -f /etc/letsencrypt/live/getvestige.com/fullchain.pem ]; then
    sudo certbot --nginx -d getvestige.com -d www.getvestige.com --non-interactive --agree-tos --email caleb@getvestige.com
fi

echo "Frontend deployment complete!"
