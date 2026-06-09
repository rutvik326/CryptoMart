package com.rutvik.Controller;

import com.rutvik.model.Coin;
import com.rutvik.model.User;
import com.rutvik.model.WatchList;
import com.rutvik.Service.CoinService;
import com.rutvik.Service.UserService;
import com.rutvik.Service.WatchListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/watchlist")
public class WatchListController {

    @Autowired
    private WatchListService watchListService;

    @Autowired
    private UserService userService;

    @Autowired
    private CoinService coinService;

    @GetMapping("/user")
    public ResponseEntity<WatchList> getUserWatchList(@RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserProfileByJwt(jwt);
        WatchList watchList = watchListService.findUserWatchList(user.getId());

        return ResponseEntity.ok(watchList);
    }

    @PostMapping("/create")
    public ResponseEntity<WatchList> createWatchList(@RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserProfileByJwt(jwt);
        WatchList createdWatchList = watchListService.createWatchList(user);

        return ResponseEntity.status(HttpStatus.CREATED).body(createdWatchList);
    }

    @GetMapping("/{watchlistId}")
    public ResponseEntity<WatchList> getWatchListById(@PathVariable Long watchlistId) throws Exception {

        WatchList watchList = watchListService.findById(watchlistId);

        return ResponseEntity.ok(watchList);
    }

    @PatchMapping("/add/coin/{coinId}")
    public ResponseEntity<Coin> addItemToWatchList(@RequestHeader("Authorization") String jwt,
                                                   @PathVariable String coinId) throws Exception {

        User user = userService.findUserProfileByJwt(jwt);
        Coin coin = coinService.findById(coinId);
        Coin addedCoin = watchListService.addItemToWatchList(coin, user);

        return ResponseEntity.ok(addedCoin);
    }
}
