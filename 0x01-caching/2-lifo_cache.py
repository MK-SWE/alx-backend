#!/usr/bin/env python3
"""
    Basic dictionary caching
"""
BaseCaching = __import__('base_caching').BaseCaching


class LIFOCache(BaseCaching):
    """
        The caching class
    """
    def __init__(self):
        """The init method"""
        super().__init__()

    def put(self, key, item):
        """insert into cache"""
        pass

    def get(self, key):
        """Retrieve the cached data"""
