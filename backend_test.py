#!/usr/bin/env python3

import requests
import json
import sys
from datetime import datetime

class LandingPageAPITester:
    def __init__(self, base_url="http://127.0.0.1:3000/legacy"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name}")
        else:
            print(f"❌ {name} - {details}")
        
        self.test_results.append({
            "name": name,
            "success": success,
            "details": details
        })

    def test_get_landing_page_settings(self, brand_slug="annamartin"):
        """Test GET /landingpage/settings/:brandSlug"""
        try:
            url = f"{self.base_url}/landingpage/settings/{brand_slug}"
            print(f"\n🔍 Testing GET {url}")
            
            response = requests.get(url, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "SUCCESS" and "settings" in data:
                    settings = data["settings"]
                    required_fields = ["brand_name", "brand_slug", "theme_color", "hero_title", "plan_price"]
                    missing_fields = [field for field in required_fields if field not in settings]
                    
                    if not missing_fields:
                        self.log_test(f"GET settings for {brand_slug}", True, f"Status: {response.status_code}, Fields: {len(settings)} present")
                        return True, settings
                    else:
                        self.log_test(f"GET settings for {brand_slug}", False, f"Missing fields: {missing_fields}")
                        return False, {}
                else:
                    self.log_test(f"GET settings for {brand_slug}", False, f"Invalid response format: {data}")
                    return False, {}
            else:
                self.log_test(f"GET settings for {brand_slug}", False, f"HTTP {response.status_code}: {response.text[:200]}")
                return False, {}
                
        except Exception as e:
            self.log_test(f"GET settings for {brand_slug}", False, f"Exception: {str(e)}")
            return False, {}

    def test_save_landing_page_settings(self, settings_data):
        """Test POST /landingpage/settings"""
        try:
            url = f"{self.base_url}/landingpage/settings"
            print(f"\n🔍 Testing POST {url}")
            
            payload = {"settings": settings_data}
            headers = {"Content-Type": "application/json"}
            
            response = requests.post(url, json=payload, headers=headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "SUCCESS":
                    self.log_test("POST save settings", True, f"Status: {response.status_code}")
                    return True, data
                else:
                    self.log_test("POST save settings", False, f"API returned FAIL: {data}")
                    return False, {}
            else:
                self.log_test("POST save settings", False, f"HTTP {response.status_code}: {response.text[:200]}")
                return False, {}
                
        except Exception as e:
            self.log_test("POST save settings", False, f"Exception: {str(e)}")
            return False, {}

    def test_new_brand_default_settings(self, new_brand="testbrand123"):
        """Test that new brands get default settings"""
        try:
            url = f"{self.base_url}/landingpage/settings/{new_brand}"
            print(f"\n🔍 Testing new brand defaults for {new_brand}")
            
            response = requests.get(url, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "SUCCESS" and "settings" in data:
                    settings = data["settings"]
                    if settings.get("brand_slug") == new_brand and settings.get("brand_name"):
                        self.log_test(f"New brand {new_brand} defaults", True, f"Got default settings with brand_slug: {new_brand}")
                        return True, settings
                    else:
                        self.log_test(f"New brand {new_brand} defaults", False, f"Incorrect brand_slug in defaults: {settings.get('brand_slug')}")
                        return False, {}
                else:
                    self.log_test(f"New brand {new_brand} defaults", False, f"Invalid response: {data}")
                    return False, {}
            else:
                self.log_test(f"New brand {new_brand} defaults", False, f"HTTP {response.status_code}")
                return False, {}
                
        except Exception as e:
            self.log_test(f"New brand {new_brand} defaults", False, f"Exception: {str(e)}")
            return False, {}

    def test_save_and_retrieve_cycle(self):
        """Test complete save and retrieve cycle"""
        test_brand = f"testbrand_{datetime.now().strftime('%H%M%S')}"
        
        # Create test settings
        test_settings = {
            "brand_name": "Test Fitness Brand",
            "brand_slug": test_brand,
            "theme_color": "#FF5733",
            "about": "This is a test fitness brand for API testing.",
            "hero_title": "Test Hero Title",
            "hero_description": "Test hero description for API testing.",
            "hero_image": "https://example.com/test-hero.jpg",
            "access_title": "Test Access Title",
            "access_description": "Test access description.",
            "access_image": "https://example.com/test-access.jpg",
            "plan_title": "Test Plan",
            "plan_price": 39.99,
            "plan_benefits": ["Test benefit 1", "Test benefit 2", "Test benefit 3"],
            "reviews": [
                {"name": "Test User", "text": "Great test program!", "rating": 5}
            ]
        }
        
        print(f"\n🔄 Testing save and retrieve cycle for {test_brand}")
        
        # Save settings
        save_success, save_data = self.test_save_landing_page_settings(test_settings)
        if not save_success:
            return False
        
        # Retrieve settings
        get_success, get_data = self.test_get_landing_page_settings(test_brand)
        if not get_success:
            return False
        
        # Verify data matches
        key_fields = ["brand_name", "theme_color", "hero_title", "plan_price"]
        for field in key_fields:
            if get_data.get(field) != test_settings.get(field):
                self.log_test("Save/Retrieve data consistency", False, f"Field {field} mismatch: saved {test_settings.get(field)}, got {get_data.get(field)}")
                return False
        
        self.log_test("Save/Retrieve data consistency", True, f"All key fields match for {test_brand}")
        return True

    def run_all_tests(self):
        """Run all backend API tests"""
        print("🚀 Starting Landing Page API Backend Tests")
        print(f"📍 Base URL: {self.base_url}")
        
        # Test 1: Get existing settings (annamartin)
        self.test_get_landing_page_settings("annamartin")
        
        # Test 2: Get settings for new brand (should return defaults)
        self.test_new_brand_default_settings()
        
        # Test 3: Complete save and retrieve cycle
        self.test_save_and_retrieve_cycle()
        
        # Print summary
        print(f"\n📊 Backend API Test Results:")
        print(f"   Tests Run: {self.tests_run}")
        print(f"   Tests Passed: {self.tests_passed}")
        print(f"   Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        if self.tests_passed == self.tests_run:
            print("✅ All backend API tests passed!")
            return True
        else:
            print("❌ Some backend API tests failed!")
            return False

def main():
    """Main test runner"""
    tester = LandingPageAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())