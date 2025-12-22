export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'farmers_smart_help_secret_key_2025_production_change_this',
  expiresIn: '30d'
};

// Debug: Log if JWT_SECRET is loaded
if (!process.env.JWT_SECRET) {
  console.warn('⚠️  Warning: JWT_SECRET not loaded from .env file. Using fallback secret.');
} else {
  console.log('✅ JWT_SECRET loaded successfully');
}
