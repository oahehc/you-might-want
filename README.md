# [Web-Monetization] Share Useful Information & Earn Real Money From It

Link: https://you-might-want.oahehc.now.sh/

The problem we want to solve through this project is that some people might have useful information. But the information is not enough to create a full article or a YouTube video. And most people are not the influencers who have tons of people follow them on Twitter or Facebook. But they might not want to give that information for free. This application applies Web Monetization to solve those kinds of problems.
Everyone can create an account and start sharing their information right away. And the application will base on the number of votes of each post to calculate the probabilistic revenue sharing.  
All in all, this application is like a Twitter account shared by all people around the world. So everyone can publish the information that think is useful here. Moreover, if the post received enough votes, the author can earn the money for it.

## Stack

React.js, Typescript, Next.js, Vercel(Zeit) Now, AWS DynamoDB, Google OAuth.

## User Types

There're three types of users on our application.

### 1. Author

Anyone can register through google account and provide their wallet. Then the users can start sharing their information on our application.  
Once the post reaches enough votes, the author will receive the profit share on their wallet.  
![wallet](https://i.imgur.com/Vl6Mp4h.png)

The post is limited by 500 characters because we wish the author can provide the information succinctly. It will allow our readers to consume as much information.  
![post-limit](https://i.imgur.com/zHuqypy.png)

### 2. Normal Reader

Everyone can start reading posts without registration.

### 3. Paid Reader

The paid reader is someone who have joined web monetization and register through Google account.
![join-web-monetization](https://i.imgur.com/hh3wGBG.png)

The paid reader will be able to rate the posts (thumb-up and thumb-down). Because the most important factor that which post should get more profit sharing is coming from the votes. Therefore, it's only the paid reader who can join the rating to decide which article is worthy to receive the money they have paid. And this will also make the rating result more trustable.  
![thumb-up](https://i.imgur.com/xK4jEwD.gif)

And we are planning to provide more advanced features for the paid reader including remove ads, collect posts, and search posts, etc.

## Issues

During the time we were working on this project, we notice that if we want to apply the sharing profit mechanism, the current policy about `web monetization` still has some problems that need to figure out some better alternative.

1. Currently, the user paid $5 per month, and the website will receives $0.0001/s. But once the user exceeds $4.50 in a month, the rate that the website receive will drop to $0.000000186/s. This means that only the user visits your website at the first 12.5 hours every month, then you will receive $0.0001/s. Otherwise, the rate will be $0.000000186/s which has a huge gap.

```
once a user exceeds $4.50 in a month they're dropped to a lower rate allowing
them to still access WM content (although this is not a permanent solution).
The lower rate is such that the user can use WM for the rest of the month
without exceeding $5. You'll mostly encounter users at the $0.0001/s rate
but a few will be sending $0.000000186/s
```

The rate is obviously not enough to attract users to share their information. If our website has 1,000 active paid users which will visit the website 1 hour per day. And we assume that we can get 10% from their first 12.5 hours (the period with $0.0001/s rate). Then the total income per month will be around $470. The amount of total income will not be enough to cover the website's operating fee. So we still have to seek for other monetization (eg. ads).

```
         1.25 hours * $0.0001/s      * 1000
+ (30 - 1.25) hours * $0.000000186/s * 1000
= 450 + 19.251
```

2. Another problem is the current revenue-sharing solution won't guarantee the author will receive the money based on the proportion. The current solution for revenue sharing is to generate different monetization meta tag for each pageview. But the revenue is based on how much time the user spent on our website. Even we can generate the monetization meta tag based on the proportion we want. The active time for each pageview is not under our control which will cause the final amount that each author received might have a large gap compared to the proportion we calculated.

[probabilistic-rev-sharing](https://webmonetization.org/docs/probabilistic-rev-sharing)

## Additional Resources/Info

- [Web Monetization](https://webmonetization.org/)
- [Coil Extension](https://help.coil.com/using-coil/coil-extension)
- [Coil Membership Account](https://help.coil.com/accounts/membership-accounts)
- [Test Web Monetization](https://testwebmonetization.com/)
