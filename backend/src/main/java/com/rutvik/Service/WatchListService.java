package com.rutvik.Service;

import com.rutvik.model.Coin;
import com.rutvik.model.User;
import com.rutvik.model.WatchList;

public interface WatchListService {

    WatchList findUserWatchList(Long userId) throws Exception;

    WatchList createWatchList(User user);

    WatchList findById(Long id) throws Exception;

    Coin addItemToWatchList(Coin coin, User user) throws Exception;
}
