import sys
import os

# Add root directory to sys.path to resolve backend package imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.app import app
