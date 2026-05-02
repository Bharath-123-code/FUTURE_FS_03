#!/usr/bin/env python
"""
QR Code Generator for SpiceHub Restaurant Tables

This script generates QR codes that point to the restaurant's frontend URL,
simulating the real-world restaurant table experience where customers can
scan QR codes to access the digital menu and ordering system.

Usage:
    python generate_qr.py --url http://localhost:5173 --table 1
    python generate_qr.py --url https://spicehub.example.com --table 5
    python generate_qr.py --url http://localhost:5173 --all
"""

import qrcode
import qrcode.constants
import argparse
import os
from datetime import datetime
from PIL import Image, ImageDraw, ImageFont

def create_restaurant_qr(url, table_number=None, output_dir="qr_codes"):
    """
    Generate a QR code for the restaurant menu with table-specific tracking
    
    Args:
        url (str): Base URL of the frontend
        table_number (int): Table number for tracking
        output_dir (str): Directory to save QR codes
    
    Returns:
        str: Path to generated QR code file
    """
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Construct the full URL with table parameter for tracking
    if table_number:
        full_url = f"{url}?table={table_number}"
        filename = f"table_{table_number}_qr.png"
    else:
        full_url = url
        filename = "restaurant_qr.png"
    
    # Create QR code instance with high error correction for restaurant use
    qr = qrcode.QRCode(
        version=1,  # Controls size of the QR code
        error_correction=qrcode.constants.ERROR_CORRECT_H,  # High error correction
        box_size=10,  # Size of each box in pixels
        border=4,     # Border size in boxes
    )
    
    # Add data to QR code
    qr.add_data(full_url)
    qr.make(fit=True)
    
    # Create QR code image
    qr_img = qr.make_image(fill_color="black", back_color="white").convert('RGB')
    
    # Create a larger canvas for restaurant branding
    canvas_size = (400, 500)
    canvas = Image.new('RGB', canvas_size, 'white')
    
    # Calculate position to center QR code
    qr_size = 300
    qr_position = ((canvas_size[0] - qr_size) // 2, 80)
    
    # Resize QR code to fit
    qr_resized = qr_img.resize((qr_size, qr_size), Image.Resampling.LANCZOS)
    
    # Paste QR code on canvas
    canvas.paste(qr_resized, qr_position)
    
    # Add restaurant branding and text
    draw = ImageDraw.Draw(canvas)
    
    try:
        # Try to use a nice font (fallback to default if not available)
        title_font = ImageFont.truetype("arial.ttf", 24)
        text_font = ImageFont.truetype("arial.ttf", 16)
    except:
        # Fallback to default font
        title_font = ImageFont.load_default()
        text_font = ImageFont.load_default()
    
    # Add restaurant name
    title_text = "SpiceHub"
    title_bbox = draw.textbbox((0, 0), title_text, font=title_font)
    title_width = title_bbox[2] - title_bbox[0]
    title_position = ((canvas_size[0] - title_width) // 2, 20)
    draw.text(title_position, title_text, fill="#FF8C00", font=title_font)
    
    # Add subtitle
    subtitle_text = "Scan to Order"
    subtitle_bbox = draw.textbbox((0, 0), subtitle_text, font=text_font)
    subtitle_width = subtitle_bbox[2] - subtitle_bbox[0]
    subtitle_position = ((canvas_size[0] - subtitle_width) // 2, 50)
    draw.text(subtitle_position, subtitle_text, fill="#333333", font=text_font)
    
    # Add table number if specified
    if table_number:
        table_text = f"Table {table_number}"
        table_bbox = draw.textbbox((0, 0), table_text, font=text_font)
        table_width = table_bbox[2] - table_bbox[0]
        table_position = ((canvas_size[0] - table_width) // 2, 400)
        draw.text(table_position, table_text, fill="#1A1A1A", font=text_font)
    
    # Add footer text
    footer_text = "Digital Menu & Ordering"
    footer_bbox = draw.textbbox((0, 0), footer_text, font=text_font)
    footer_width = footer_bbox[2] - footer_bbox[0]
    footer_position = ((canvas_size[0] - footer_width) // 2, 460)
    draw.text(footer_position, footer_text, fill="#666666", font=text_font)
    
    # Save the final QR code
    output_path = os.path.join(output_dir, filename)
    canvas.save(output_path, "PNG", quality=95)
    
    print(f"✅ QR Code generated: {output_path}")
    print(f"🔗 URL: {full_url}")
    
    return output_path

def generate_all_tables(url, num_tables=20, output_dir="qr_codes"):
    """
    Generate QR codes for all restaurant tables
    
    Args:
        url (str): Base URL of the frontend
        num_tables (int): Number of tables to generate QR codes for
        output_dir (str): Directory to save QR codes
    """
    print(f"🍽️ Generating QR codes for {num_tables} tables...")
    
    generated_files = []
    for table_num in range(1, num_tables + 1):
        try:
            file_path = create_restaurant_qr(url, table_num, output_dir)
            generated_files.append(file_path)
        except Exception as e:
            print(f"❌ Error generating QR for Table {table_num}: {e}")
    
    print(f"\n✨ Successfully generated {len(generated_files)} QR codes!")
    print(f"📁 Saved in: {os.path.abspath(output_dir)}")
    
    return generated_files

def print_table_info(url, num_tables=20):
    """
    Print a formatted table of QR code information for restaurant staff
    
    Args:
        url (str): Base URL of the frontend
        num_tables (int): Number of tables
    """
    print("\n" + "="*80)
    print("🍽️  SPICEHUB RESTAURANT - QR CODE INFORMATION")
    print("="*80)
    print(f"📱 Frontend URL: {url}")
    print(f"🪑 Total Tables: {num_tables}")
    print("\n📋 Table QR Code URLs:")
    print("-" * 80)
    
    for table in range(1, num_tables + 1):
        table_url = f"{url}?table={table}"
        print(f"Table {table:2d}: {table_url}")
    
    print("-" * 80)
    print("💡 Usage Instructions:")
    print("1. Print the QR codes and place them on restaurant tables")
    print("2. Customers scan QR codes to access the digital menu")
    print("3. Table parameter helps with order tracking and waiter assignment")
    print("4. QR codes include high error correction for reliable scanning")
    print("="*80)

def main():
    parser = argparse.ArgumentParser(
        description="Generate QR codes for SpiceHub restaurant tables",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python generate_qr.py --url http://localhost:5173 --table 1
  python generate_qr.py --url https://spicehub.example.com --table 5
  python generate_qr.py --url http://localhost:5173 --all
  python generate_qr.py --url https://spicehub.example.com --all --tables 10
        """
    )
    
    parser.add_argument(
        "--url", 
        required=True,
        help="Frontend URL (e.g., http://localhost:5173 or https://spicehub.example.com)"
    )
    
    parser.add_argument(
        "--table", 
        type=int,
        help="Generate QR code for specific table number"
    )
    
    parser.add_argument(
        "--all", 
        action="store_true",
        help="Generate QR codes for all tables (default: 20 tables)"
    )
    
    parser.add_argument(
        "--tables", 
        type=int,
        default=20,
        help="Number of tables when using --all (default: 20)"
    )
    
    parser.add_argument(
        "--output", 
        default="qr_codes",
        help="Output directory for QR codes (default: qr_codes)"
    )
    
    parser.add_argument(
        "--info", 
        action="store_true",
        help="Print table information without generating QR codes"
    )
    
    args = parser.parse_args()
    
    # Validate arguments
    if not args.table and not args.all and not args.info:
        parser.error("Please specify either --table, --all, or --info")
    
    if args.table and args.all:
        parser.error("Cannot specify both --table and --all")
    
    # Print table information
    if args.info:
        print_table_info(args.url, args.tables)
        return
    
    # Generate QR codes
    print("🍽️ SpiceHub QR Code Generator")
    print("=" * 50)
    print(f"📱 Target URL: {args.url}")
    print(f"📁 Output Directory: {args.output}")
    print(f"⏰ Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("-" * 50)
    
    if args.table:
        # Generate single table QR code
        create_restaurant_qr(args.url, args.table, args.output)
    elif args.all:
        # Generate all table QR codes
        generate_all_tables(args.url, args.tables, args.output)
    
    print("\n🎉 QR Code generation complete!")
    print("🖨️  Print the QR codes and place them on restaurant tables")

if __name__ == "__main__":
    main()
