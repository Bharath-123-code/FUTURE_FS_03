# 🍽️ SpiceHub Digital Restaurant Management System

A comprehensive digital restaurant management system with real-time order tracking, waiter notifications, and customer self-service capabilities.

## 📋 Table of Contents

- [🏗️ Architecture Overview](#-architecture-overview)
- [⚖️ Load Balancing Algorithm](#️-load-balancing-algorithm)
- [🎨 Visual Design & Theme](#-visual-design--theme)
- [🐍 Python Backend Stack](#-python-backend-stack)
- [⚛️ React Frontend Stack](#-react-frontend-stack)
- [📞 Twilio Integration](#-twilio-integration)
- [📞 Missed Call System](#-missed-call-system)
- [🚀 Deployment](#-deployment)
- [🔧 Development Setup](#-development-setup)

## 🏗️ Architecture Overview

SpiceHub is a full-stack restaurant management system that solves common restaurant operational challenges through intelligent automation and real-time communication.

### Key Features
- **Digital Menu**: Customer self-service ordering via QR codes
- **Real-time Order Tracking**: Live status updates for customers
- **Waiter Management**: Automatic order assignment and capacity management
- **Smart Notifications**: WhatsApp alerts and missed call notifications
- **Load Balancing**: Intelligent waiter assignment based on current workload
- **Mobile Responsive**: Optimized for all device sizes
- **Chalkboard Theme**: High-end restaurant aesthetic with custom background
- **Image Slideshows**: Dynamic content presentation in Hero and Brand sections
- **Missed Call System**: Automatic tracking of failed waiter notifications
- **Enhanced UI**: Glassmorphism effects and floating ingredient elements

## ⚖️ Load Balancing Algorithm

### Waiter Capacity Logic

The system implements an intelligent load balancing algorithm to ensure fair and efficient waiter assignment:

#### Core Algorithm
```python
# Find first available waiter with capacity
available_waiter = Waiter.objects.filter(
    current_orders__lt=models.F('max_capacity')
).first()
```

#### Algorithm Steps

1. **Capacity Check**: 
   - Filters waiters where `current_orders < max_capacity`
   - Uses Django's `F()` expression for atomic comparison

2. **Priority Assignment**:
   - Selects the first available waiter (FIFO order)
   - Ensures fair distribution among available staff

3. **Atomic Update**:
   - Increments waiter's `current_orders` count
   - Saves order with assigned waiter reference
   - All operations in single database transaction

#### Load Balancing Benefits

- **Fair Distribution**: Prevents overloading individual waiters
- **Automatic Scaling**: Handles varying restaurant traffic
- **Real-time Capacity**: Live updates of waiter availability
- **Failover Protection**: System gracefully handles busy periods

#### Example Scenario

```
Waiter A: current_orders=2, max_capacity=3  ✅ Available
Waiter B: current_orders=3, max_capacity=3  ❌ Full
Waiter C: current_orders=1, max_capacity=3  ✅ Available

Result: Waiter A gets the next order (FIFO priority)
```

## 🐍 Python Backend Stack

### Core Technologies

- **Django 6.0.4**: Web framework for robust API development
- **Django REST Framework 3.17.1**: RESTful API with serialization
- **Django CORS Headers 4.9.0**: Cross-origin resource sharing
- **Twilio 9.10.5**: WhatsApp and Voice API integration
- **SQLite**: Default database (easily configurable for PostgreSQL/MySQL)

### API Endpoints

#### Waiter Management
- `GET /api/waiters/` - List all waiters
- `GET /api/waiters/available/` - Get available waiters only
- `GET /api/waiters/{id}/` - Get specific waiter details

#### Order Management
- `GET /api/orders/` - List all orders
- `POST /api/orders/` - Create new order
- `GET /api/orders/{id}/` - Get order details
- `POST /api/orders/{id}/accept_order/` - Accept order
- `POST /api/orders/{id}/complete_order/` - Complete order

#### Menu Management
- `GET /api/categories/` - List menu categories
- `GET /api/menu-items/` - List all menu items
- `GET /api/menu-items/?category={id}` - Filter by category

### Database Models

#### Waiter Model
```python
class Waiter(models.Model):
    name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=20)
    max_capacity = models.IntegerField(default=3)
    current_orders = models.IntegerField(default=0)
    is_available = models.BooleanField(default=True)
```

#### Order Model
```python
class Order(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Accepted', 'Accepted'),
        ('Completed', 'Completed'),
    ]
    
    table_number = models.IntegerField()
    items = models.JSONField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    assigned_waiter = models.ForeignKey(Waiter, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
```

## 🎨 Visual Design & Theme

### Chalkboard Theme Implementation

SpiceHub features a sophisticated chalkboard aesthetic that creates a premium dining atmosphere:

#### Design Elements
- **Dark Charcoal Background**: `#121212` base color for authentic chalkboard appearance
- **Chalk Dust Texture**: Subtle radial gradients simulate natural chalk residue
- **Glassmorphism Cards**: Semi-transparent backgrounds with backdrop blur effects
- **Floating Ingredients**: Animated SVG elements (chili, tomato, herbs, pepper) in screen corners
- **Custom Background**: Full-screen background image with 70% opacity for visual depth

#### CSS Implementation
```css
/* Chalkboard container with texture */
.chalkboard-container {
  position: relative;
  z-index: 1;
}

/* Chalk dust overlay effect */
.chalkboard-container::before {
  background: 
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.02) 0%, transparent 40%);
}

/* Glassmorphism cards */
.chalkboard-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}
```

#### Image Slideshows
- **Hero Section**: Auto-rotating images every 3 seconds (tablet view)
- **Brand Showcase**: Restaurant imagery with 4-second intervals and slide indicators
- **Smooth Transitions**: CSS opacity transitions for professional appearance

## ⚛️ React Frontend Stack

### Core Technologies

- **React 18**: Modern UI library with hooks
- **React Router DOM**: Client-side routing
- **Framer Motion**: Smooth animations and transitions
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API communication

### Key Components

#### Customer Interface
- **Hero Section**: Animated landing with call-to-action
- **CategoryGrid**: Horizontal scrollable categories with fade-in animations
- **ProductCard**: Menu items with add-to-cart functionality
- **CheckoutModal**: Responsive checkout with waiter selection
- **OrderTracking**: Real-time order progress visualization

#### Waiter Interface
- **WaiterDashboard**: Order management interface
- **Real-time Updates**: 30-second polling for live data
- **Order Actions**: Accept/Complete order functionality

#### Animation Features
- **Staggered Animations**: Category cards fade-in sequentially
- **Pulsing Effects**: Active order tracking steps
- **Smooth Transitions**: Mobile menu slide animations
- **Hover States**: Interactive feedback throughout

### Responsive Design

- **Mobile First**: Optimized for phones and tablets
- **Breakpoints**: 
  - Mobile: `grid-cols-1`
  - Tablet: `sm:grid-cols-2`
  - Desktop: `lg:grid-cols-4`
- **Touch Targets**: 44px minimum button sizes
- **Flexible Layouts**: Adapts to all screen sizes

## 📞 Twilio Integration

### Solving the "Noisy Kitchen" Problem

Traditional restaurants struggle with communication in noisy kitchen environments. SpiceHub solves this using Twilio's Voice API with intelligent missed call notifications.

#### The Problem
- Loud kitchen environments make verbal notifications unreliable
- Waiters may miss critical order alerts
- Inconsistent communication leads to delayed service

#### The Solution: 5-Second Missed Calls

```python
# TwiML for missed call notification
twiml_response = VoiceResponse()
twiml_response.play(digits="9")  # Beep sound
twiml_response.pause(length=3)    # 3-second pause
twiml_response.append(Hangup())   # Automatic hangup

# Initiate call
voice_call = client.calls.create(
    twiml=str(twiml_response),
    from_=settings.TWILIO_PHONE_NUMBER,
    to=waiter.phone_number,
    timeout=10
)
```

#### How It Works

1. **Order Placement**: Customer places order via digital menu
2. **Waiter Assignment**: System assigns available waiter
3. **WhatsApp Alert**: Detailed order information sent via WhatsApp
4. **Missed Call**: 5-second call creates immediate attention
5. **Visual Cue**: Missed call notification on waiter's phone
6. **Order Details**: Waiter checks WhatsApp for full order information

#### Benefits

- **Reliable**: Works in any noise level
- **Non-Intrusive**: No answering required
- **Instant**: Immediate visual notification
- **Detailed**: WhatsApp provides complete order information
- **Professional**: Modern communication standard

#### Call Flow

```
Incoming Call → Beep Sound → 3 Second Pause → Hangup (2 rings total)
                ↓
            Missed Call Notification
                ↓
        Waiter Checks WhatsApp for Order Details
```

## � Missed Call System

### Advanced Call Tracking

SpiceHub includes a comprehensive missed call tracking system that monitors and manages failed waiter notifications:

#### System Architecture
```python
class MissedCall(models.Model):
    waiter = models.ForeignKey(Waiter, on_delete=models.CASCADE)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, null=True, blank=True)
    phone_number = models.CharField(max_length=20)
    call_sid = models.CharField(max_length=100, blank=True)
    call_status = models.CharField(max_length=50, default='failed')
    reason = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    resolved = models.BooleanField(default=False)
    resolved_at = models.DateTimeField(null=True, blank=True)
```

#### Key Features
- **Automatic Tracking**: Failed Twilio calls automatically create missed call records
- **Real-time Notifications**: Live missed call display in management interface
- **Resolution Tracking**: Mark calls as resolved when handled
- **Detailed Logging**: Complete error reasons and timestamps
- **Waiter Performance**: Track missed calls per waiter for optimization

#### API Endpoints
- `GET /api/missed-calls/` - List all missed calls
- `GET /api/missed-calls/unresolved/` - Get only unresolved missed calls
- `POST /api/missed-calls/{id}/resolve/` - Mark missed call as resolved

#### Frontend Integration
```jsx
// Real-time missed call notifications
<MissedCalls />
```
- Fixed position overlay (top-right corner)
- Chalkboard theme matching design
- One-click resolution functionality
- Auto-refresh every 30 seconds

#### Benefits
- **Accountability**: Track communication failures
- **Performance Metrics**: Monitor waiter responsiveness
- **Problem Resolution**: Quick identification of issues
- **Customer Service**: Ensure no orders are missed

## �� Deployment

### Production Deployment

#### Backend (Heroku/Render)
```bash
# Install dependencies
pip install -r requirements.txt

# Environment Variables
export TWILIO_ACCOUNT_SID="your_sid"
export TWILIO_AUTH_TOKEN="your_token"
export TWILIO_PHONE_NUMBER="+1234567890"

# Deploy
git push heroku main
```

#### Frontend (Vercel/Netlify)
```bash
# Build for production
npm run build

# Deploy
npm run deploy
```

### Required Files
- `requirements.txt` - Python dependencies
- `Procfile` - Heroku deployment configuration
- `package.json` - Node.js dependencies
- `tailwind.config.js` - Tailwind CSS configuration

## 🔧 Development Setup

### Backend Setup
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Start development server
python manage.py runserver
```

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### QR Code Generation
```bash
# Generate QR codes for restaurant tables
python generate_qr.py --url http://localhost:5173 --all

# Generate specific table QR code
python generate_qr.py --url http://localhost:5173 --table 1
```

## 🎯 System Features

### Customer Experience
- **QR Code Access**: Scan table QR code to open digital menu
- **Real-time Tracking**: Live order status updates
- **Mobile Optimized**: Works perfectly on smartphones
- **Instant Feedback**: Order confirmation and tracking

### Restaurant Operations
- **Load Balancing**: Fair waiter assignment
- **Real-time Notifications**: WhatsApp and missed call alerts
- **Capacity Management**: Automatic availability tracking
- **Order Management**: Complete order lifecycle tracking

### Technical Excellence
- **Scalable Architecture**: Handles high traffic volumes
- **Real-time Updates**: Live data synchronization
- **Error Handling**: Graceful failure recovery
- **Security Best Practices**: Protected API endpoints

---

## 📱 Contact & Support

For technical support or questions about the SpiceHub system, please refer to the development documentation or contact the development team.

**Built with ❤️ for modern restaurants**
