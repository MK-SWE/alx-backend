#!/usr/bin/env python3
"""
    The Helper function for the pagination mechanism
"""


def index_range(page, page_size) :
    """
    that takes two integer arguments page and page_size.
    The function should return a tuple of size two containing
    a start index and an end index corresponding to the range of indexes
    to return in a list for those particular pagination parameters.
    """
    if page == 1:
        return (0, page * page_size)
    else:
        return ((page - 1) * page_size, page * page_size)
