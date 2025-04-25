import pandas as pd
import numpy as np
from datetime import datetime
from calendar import month_name
import re
import sys
from urllib.parse import urlparse
from difflib import get_close_matches
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Fix UnicodeEncodeError in Windows terminal
try:
    sys.stdout.reconfigure(encoding='utf-8')
except AttributeError:
    pass  # For older Python versions where reconfigure isn't available

def load_dataset():
    """Load the dataset from CSV file"""
    try:
        df = pd.read_csv('price_dataset_cleaned.csv')
        df['sell_date'] = pd.to_datetime(df['sell_date'])
        return df
    except Exception as e:
        print(f"Error loading dataset: {e}")
        return None

def extract_product_name(url):
    """Extract product name from URL"""
    try:
        path = urlparse(url).path
        product_name = path.split('/')[-1]
        product_name = re.sub(r'[_-]', ' ', product_name)
        product_name = re.sub(r'\d+', '', product_name)
        return product_name.strip()
    except:
        return None

def find_similar_products(df, product_name, merchant=None, threshold=0.6):
    """Find similar products in the dataset"""
    search_query = product_name.lower()
    exact_matches = df[df['product_name'].str.lower() == search_query]
    if len(exact_matches) > 0:
        return exact_matches, "exact"
    
    all_products = df['product_name'].unique()
    similar_products = get_close_matches(search_query, [p.lower() for p in all_products], n=5, cutoff=threshold)
    
    if similar_products:
        return df[df['product_name'].str.lower().isin(similar_products)], "fuzzy"
    
    words = search_query.split()
    for word in words:
        if len(word) > 3:
            matches = df[df['product_name'].str.lower().str.contains(word, na=False)]
            if len(matches) > 0:
                return matches, "partial"
    
    return pd.DataFrame(), "none"

def get_price_recommendations(df, product_name, month):
    recommendations = {}
    
    for merchant in ['Amazon', 'Flipkart', 'Myntra', 'Ajio']:
        similar_products, match_type = find_similar_products(df, product_name, merchant)
        
        if len(similar_products) > 0:
            merchant_products = similar_products[
                (similar_products['merchant'] == merchant) & 
                (similar_products['sell_date'].dt.month == month)
            ]
            if len(merchant_products) > 0:
                avg_price = merchant_products['price'].mean()
                min_price = merchant_products['price'].min()
                max_price = merchant_products['price'].max()
                
                recommendations[merchant] = {
                    'price': round(avg_price, 2),
                    'min_price': round(min_price, 2),
                    'max_price': round(max_price, 2),
                    'count': len(merchant_products),
                    'similar_products': similar_products['product_name'].head(3).tolist(),
                    'match_type': match_type
                }
    
    return recommendations

def print_recommendations(product_name, recommendations, month):
    print(f"\n💰 Price Recommendations for '{product_name}'")
    print(f"📅 Month: {month_name[month]}")
    print("=" * 50 + "\n")
    
    if not recommendations:
        print("❌ No similar products found in the dataset.")
        print("💡 Try searching with a different product name or check the spelling.")
        print("💡 You can try:\n   - General terms (e.g., 'laptop')\n   - Brand names (e.g., 'Samsung')\n   - Product categories (e.g., 'smartphone')\n")
        return
    
    has_exact_match = any(data.get('match_type') == 'exact' for data in recommendations.values())
    if not has_exact_match:
        print("⚠️ No exact matches found. Showing similar products instead.")
        print("💡 These are based on similar items in the database.\n")
    
    print("🔍 Found similar products:\n")
    
    for merchant, data in recommendations.items():
        print(f"🏪 {merchant}:")
        print(f"   Predicted Price: ₹{data['price']:,.2f}")
        print(f"   Price Range: ₹{data['min_price']:,.2f} - ₹{data['max_price']:,.2f}")
        print(f"   Based on {data['count']} similar products")
        print("   Similar products:")
        for product in data['similar_products']:
            print(f"   - {product}")
        print()
    
    best_deal = min(recommendations.items(), key=lambda x: x[1]['price'])
    print("💡 Best Deal:")
    print(f"   {best_deal[0]} offers the lowest price at ₹{best_deal[1]['price']:,.2f}")
    
    for merchant, data in recommendations.items():
        if merchant != best_deal[0]:
            savings = data['price'] - best_deal[1]['price']
            savings_percent = (savings / data['price']) * 100
            print(f"   Save ₹{savings:,.2f} ({savings_percent:.1f}%) compared to {merchant}")
    print()

def main():
    print("\n💰 Welcome to the Simple Price Recommendation System 💰")
    print("Loading dataset...")
    
    df = load_dataset()
    if df is None:
        return
    
    current_month = datetime.now().month
    
    while True:
        print("\nWhat would you like to do?")
        print("1. Enter product name")
        print("2. Enter product URL")
        print("3. Exit")
        
        choice = input("\nEnter your choice (1-3): ")
        
        if choice == '1':
            product_name = input("\nEnter product name: ")
            print("\n🔍 Analyzing prices...")
            current_recommendations = get_price_recommendations(df, product_name, current_month)
            print("\n📅 Current Month Prices:")
            print_recommendations(product_name, current_recommendations, current_month)
            
            if current_recommendations:
                print("\n🎉 Festive Season Prices (October-December):\n")
                for month in [10, 11, 12]:
                    festive_recommendations = get_price_recommendations(df, product_name, month)
                    print_recommendations(product_name, festive_recommendations, month)
                
                print("\n📈 Price Trend Analysis:")
                print("=" * 50 + "\n")
                for merchant, data in current_recommendations.items():
                    current_price = data['price']
                    festive_prices = []
                    for month in [10, 11, 12]:
                        festive_data = get_price_recommendations(df, product_name, month)
                        if merchant in festive_data:
                            festive_prices.append(festive_data[merchant]['price'])
                    if festive_prices:
                        best_festive_price = min(festive_prices)
                        savings = current_price - best_festive_price
                        savings_percent = (savings / current_price) * 100
                        print(f"{merchant}:")
                        print(f"Current: ₹{current_price:,.2f}")
                        print(f"Best Festive Price: ₹{best_festive_price:,.2f}")
                        print(f"Potential Savings: ₹{savings:,.2f} ({savings_percent:.1f}%)")
                        print("💡 Consider waiting for festive season!" if savings > 0 else "💡 Current price is competitive!")
                        print()
        
        elif choice == '2':
            url = input("\nEnter product URL: ")
            product_name = extract_product_name(url)
            if product_name:
                print(f"\nExtracted product name: {product_name}")
                print("\n🔍 Analyzing prices...")
                current_recommendations = get_price_recommendations(df, product_name, current_month)
                print("\n📅 Current Month Prices:")
                print_recommendations(product_name, current_recommendations, current_month)
                
                if current_recommendations:
                    print("\n🎉 Festive Season Prices (October-December):\n")
                    for month in [10, 11, 12]:
                        festive_recommendations = get_price_recommendations(df, product_name, month)
                        print_recommendations(product_name, festive_recommendations, month)
                    
                    print("\n📈 Price Trend Analysis:")
                    print("=" * 50 + "\n")
                    for merchant, data in current_recommendations.items():
                        current_price = data['price']
                        festive_prices = []
                        for month in [10, 11, 12]:
                            festive_data = get_price_recommendations(df, product_name, month)
                            if merchant in festive_data:
                                festive_prices.append(festive_data[merchant]['price'])
                        if festive_prices:
                            best_festive_price = min(festive_prices)
                            savings = current_price - best_festive_price
                            savings_percent = (savings / current_price) * 100
                            print(f"{merchant}:")
                            print(f"Current: ₹{current_price:,.2f}")
                            print(f"Best Festive Price: ₹{best_festive_price:,.2f}")
                            print(f"Potential Savings: ₹{savings:,.2f} ({savings_percent:.1f}%)")
                            print("💡 Consider waiting for festive season!" if savings > 0 else "💡 Current price is competitive!")
                            print()
            else:
                print("\n❌ Could not extract product name from URL. Please try entering it manually.")
        
        elif choice == '3':
            print("\nThank you for using the Price Recommendation System! Goodbye! 👋")
            break
        
        else:
            print("\n❌ Invalid choice. Please enter 1, 2, or 3.")

if __name__ == "__main__":
    main()
