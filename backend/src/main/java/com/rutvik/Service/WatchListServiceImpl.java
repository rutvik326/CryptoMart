package com.rutvik.Service;

import com.rutvik.model.Coin;
import com.rutvik.model.User;
import com.rutvik.model.WatchList;
import com.rutvik.Repository.WatchListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class WatchListServiceImpl implements WatchListService {

    @Autowired
    private WatchListRepository watchListRepository;

    @Override
    public WatchList findUserWatchList(Long userId) throws Exception {
        WatchList watchList = watchListRepository.findByUserId(userId);

        if (watchList == null) {
            throw new Exception("Watch list not found");
        }

        return watchList;
    }

    @Override
    public WatchList createWatchList(User user) {
        WatchList watchList = new WatchList();
        watchList.setUser(user);

        return watchListRepository.save(watchList);
    }

    @Override
    public WatchList findById(Long id) throws Exception {
        return watchListRepository.findById(id)
                .orElseThrow(() -> new Exception("Watch list not found"));
    }

    @Override
    public Coin addItemToWatchList(Coin coin, User user) throws Exception {

        WatchList watchList = findUserWatchList(user.getId());

        if (watchList.getCoins().contains(coin)) {
            watchList.getCoins().remove(coin);
        } else {
            watchList.getCoins().add(coin);
        }

        watchListRepository.save(watchList);

        return coin;
    }
}
