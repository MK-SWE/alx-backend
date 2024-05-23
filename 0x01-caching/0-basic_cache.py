#!/usr/bin/env python3
"""
    Basic dictionary caching
"""
from base_caching import BaseCaching


class BasicCache(BaseCaching):
    """
        The caching class
    """
    def __init__(self):
        """The init method"""
        super().__init__()

    def put(self, key, item):
        """insert into cache"""
        if key is None or item is None:
            return
        self.cache_data[key] = item

    def get(self, key):
        """Retrieve the cached data"""
        if key is None:
            return None
        return self.cache_data.get(key)
