# AWS Lightsail Setup Guide for Vestige Marketing Site

## 1. AWS Account Setup

1. Go to [AWS Console](https://aws.amazon.com/)
2. Create an account if you don't have one
3. Add a payment method

## 2. Create Lightsail Instance

1. Go to [Lightsail Console](https://lightsail.aws.amazon.com/)
2. Click "Create instance"
3. Choose instance location (preferably US East)
4. Select "Linux/Unix" platform
5. Select "Node.js" blueprint
6. Choose the $5/month plan (1 GB RAM)
7. Name your instance "vestige-marketing"
8. Click "Create instance"

## 3. Configure DNS

1. Go to Lightsail console
2. Click "Networking"
3. Create static IP:
   - Click "Create static IP"
   - Select your instance
   - Name it "vestige-marketing-ip"
   - Click "Create"

4. Create DNS Zone:
   - Click "Create DNS zone"
   - Enter "getvestige.com"
   - Click "Create DNS zone"
   - Note down the nameservers provided

5. Add DNS Records:
   ```
   A Record:
   - Name: @ (root domain)
   - Points to: Your static IP
   
   A Record:
   - Name: www
   - Points to: Your static IP
   ```

6. Update domain nameservers at your domain registrar with AWS nameservers

## 4. Instance Setup

1. Click your instance name
2. Click "Connect using SSH"
3. Run these commands:

```bash
# Update system
sudo apt-get update
sudo apt-get upgrade -y

# Install Node.js 16
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install Git
sudo apt-get install -y git

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt-get install -y nginx
```

## 5. Deploy Code

1. Clone repository:
```bash
cd ~
git clone <your-repo-url>
cd frontend
```

2. Create .env file:
```bash
cp .env.example .env
nano .env
```

Add:
```
MONGODB_URI=mongodb://localhost:27017/vestige
PORT=3000
DOMAIN=www.getvestige.com
```

3. Install dependencies and start server:
```bash
npm install
chmod +x deploy.sh
./deploy.sh
```

## 6. Configure Firewall

1. Go to instance networking tab
2. Add rules:
   - HTTP (80)
   - HTTPS (443)
   - Custom TCP (3000)

## 7. SSL Setup

The deploy script will handle SSL setup, but verify with:
```bash
sudo certbot certificates
```

## 8. Verify Setup

1. Visit https://www.getvestige.com
2. Test waitlist form
3. Check MongoDB:
```bash
mongosh
use vestige
db.waitlistentries.find()
```

## Monitoring

1. View application logs:
```bash
pm2 logs vestige-frontend
```

2. Monitor server status:
```bash
pm2 status
```

3. View Nginx logs:
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Backup

1. MongoDB backup:
```bash
mongodump --db vestige --out ~/backup/$(date +%Y%m%d)
```

2. Download backup locally:
```bash
scp -r ubuntu@[your-instance-ip]:~/backup ./
```

## Cost Management

- Instance: $5/month
- Static IP: Free when attached to instance
- DNS Zone: $0.50/month
- Data transfer: Free up to 1TB/month

Total: ~$5.50/month

## Scaling

If needed, you can:
1. Upgrade to a larger instance size
2. Add a load balancer
3. Set up CloudFront CDN
4. Move MongoDB to Atlas

## Troubleshooting

1. If site is not accessible:
```bash
sudo nginx -t
sudo systemctl status nginx
pm2 status
```

2. If MongoDB issues:
```bash
sudo systemctl status mongod
```

3. If SSL issues:
```bash
sudo certbot --nginx -d getvestige.com -d www.getvestige.com --dry-run
```

For additional help, check AWS Lightsail documentation or contact support.
