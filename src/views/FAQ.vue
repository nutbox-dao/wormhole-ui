<template>
  <div class="faq-view overflow-auto">
    <div class="border-b-0.5px 2md:border-b-0 border-color8B/30 light:border-colorD6
                flex items-center justify-center gap-30px h-70px pt-23px 2md:h-48px 2md:pt-0 text-14px font-bold">
      <button @click="$router.go(-1)"
              class="absolute left-15px 2md:hidden">
        <i class="icon-back w-20px h-20px"></i>
      </button>
      <div class="c-text-black text-center py-1rem text-1.5rem md:text-1.2rem">{{$t('faq')}}</div>
      <LanguageChangeButtonVue class="absolute right-15px 2md:hidden"/>
    </div>
    <div class="container mx-auto text-left max-w-43rem fade-in c-text-medium p-15px break-word">
      <div v-if="$i18n.locale==='zh'">
        <div class="bg-blockBg light:bg-white light:shadow-popper-tip rounded-12px py-1rem px-1.5rem mb-1rem">
          <div class="c-text-black text-18px 2md:text-20px">
            1、虫洞3是做什么的？
          </div>
          <div class="text-14px leading-24px mt-1rem">
            虫洞3（wormhole3）是由去中心化代码和协议控制的web3应用程序，通过策展传播和量化贡献，
            打通web2和web3世界，帮助web3社区扩大影响力，为社区成员带来tweet to earn激励。
          </div>
        </div>
        <div class="bg-blockBg light:bg-white light:shadow-popper-tip rounded-12px py-1rem px-1.5rem mb-1rem overflow-hidden">
          <div class="c-text-black text-18px 2md:text-20px">
            2、如何参与社区宣传推广？
          </div>
          <div class="text-14px leading-24px mt-1rem">
            <ul class="list-disc pl-30px">
              <li class="mb-15px">
                <div class="c-text-black">创建内容：</div>
                <div>
                  在虫洞3平台或在推特上直接发布一条宣传自己社区的推文，并带上虫洞3平台的识别标签<strong class="text-color62 c-text-black">#iweb3</strong>
                  以及自己社区的特有标签（如Memeferc-20社区的标签是 <strong  class="text-color62 c-text-black">#ferc</strong>）
                  即可。如果有人对你的推文进行喜欢、转发等操作，你可以获取到针对内容创建者的贡献激励。
                  对于觉得优秀的推文，你还可以引用推文发帖，带上相应的标签，也可以创建策展。
                </div>
              </li>
              <li>
                <div class="c-text-black">策展内容：</div>
                <ul class="list-alpha pl-15px">
                  <li>在虫洞3平台上对别人发布的推文进行喜欢、转发操作，即为策展行为。你可以获取到相应的策展者激励。</li>
                  <li>目前，你只能在虫洞3平台上完成策展操作</li>
                </ul>
                <div class="mt-15px">举例如下：</div>
                <img src="~@/assets/faq-2.webp" alt="">
              </li>
            </ul>
          </div>

        </div>
        <div class="bg-blockBg light:bg-white light:shadow-popper-tip rounded-12px py-1rem px-1.5rem mb-1rem">
          <div class="c-text-black text-18px 2md:text-20px">
            3、如何查看我的激励？
          </div>
          <div class="text-14px leading-24px mt-1rem">
            在虫洞3平台点击任意推文，都可以看到这个推文所有参与者的激励情况。在“我的”板块，可以查看所有与我有关的推文。
            注意每一个推文展示的激励都是当前预估的金额（因为不确定后面会发生什么操作，也许参与人非常多，那每个人分得的就会变少），
            当一个推文发布后72小时会进行最终结算。
          </div>
          <img class="mb-15px" src="~@/assets/faq-3-1.webp" alt="">
          <img src="~@/assets/faq-3-2.webp" alt="">
        </div>
        <div class="bg-blockBg light:bg-white light:shadow-popper-tip rounded-12px py-1rem px-1.5rem mb-1rem">
          <div class="c-text-black text-18px 2md:text-20px">
            4、如何领取我的激励？
          </div>
          <div class="text-14px leading-24px mt-1rem">
            在虫洞3平台的“钱包/我的奖励”板块，可以查看所有已经结算完毕的奖励（每个推文发布后72小时进行结算）。
            链接以太坊钱包、切换到arbiturm网络，就可以点击领取了。注意需要在arbitrum网络预留一点eth作为gas费。
          </div>
          <img src="~@/assets/faq-4.webp" alt="">
        </div>
        <div class="bg-blockBg light:bg-white light:shadow-popper-tip rounded-12px py-1rem px-1.5rem mb-1rem">
          <div class="c-text-black text-18px 2md:text-20px">
            5、为什么我推特上的数据和虫洞3的数据不一致呢？
          </div>
          <div class="text-14px leading-24px mt-1rem">
            虫洞3使用推特发布的接口获取数据，其中转推 （retweet）、 关注 （follow）数据暂时无法获取。
            只能获取到点赞（ like）、 评论（reply） 、和引用（数据），这其中点赞数据为最近3天在虫洞3活跃的且已注册用户数据。
            评论和引用需含有社区特有标签（如 #ferc ）才能会获取到。
          </div>
          <div class="w-full flex flex-col md:flex-row">
            <img class="w-full md:w-1/2" src="~@/assets/faq-5-1.webp" alt="">
            <img class="w-full md:w-1/2" src="~@/assets/faq-5-2.webp" alt="">
          </div>
        </div>
        <div class="bg-blockBg light:bg-white light:shadow-popper-tip rounded-12px py-1rem px-1.5rem mb-1rem">
          <div class="c-text-black text-18px 2md:text-20px">
            6、什么是社区信用（community credit）？
          </div>
          <div class="text-14px leading-24px mt-1rem">
            社区信用可以理解为是每个社区贡献者的积分，是由每个社区自己设计和设置的。可能包括推特热度、社区代币质押贡献等不同权重的分类。<br>
            社区成员的社区信用值越高，对一个推文的贡献就越大，获取的激励也就越高。
          </div>
          <img src="~@/assets/faq-6.webp" alt="">
        </div>
        <div class="bg-blockBg light:bg-white light:shadow-popper-tip rounded-12px py-1rem px-1.5rem mb-1rem">
          <div class="c-text-black text-18px 2md:text-20px">
            7、什么是op，什么是vp？
          </div>
          <div class="text-14px leading-24px mt-1rem">
            <ul class="list-disc pl-30px">
              <li class="mb-15px">
                <div class="c-text-black">Operation Power (OP): </div>
                <div>
                  任何与内容相关的行为都需要消耗OP （包括发帖，点赞，转推，引用， 回复和关注），每个行为的具体消耗量如下表格。
                  初始，每人有2000 OP值，恢复时间为3天。如OP值不足，则行为无法上链，也无法获得相应奖励，但不影响在Twitter上的正常操作。
                </div>
              </li>
              <li>
                <div class="c-text-black">Voting Power (VP): </div>
                <div>
                  所有策展行为都需要消耗VP (包括点赞，转推，引用，回复)，每个行为的具体消耗量如下表格。
                  初始，每人有200 VP值，恢复时间为3天。如VP值不足，则无法策展，也无法获得相应奖励，但不影响在Twitter上的正常操作。
                </div>
              </li>
            </ul>
            <div class="w-full overflow-auto no-scroll-bar opacity-70 xs:pl-30px mt-15px">
              <table>
                <tbody class="border-l-1 border-t-1 border-white">
                <tr class="border-b-1 border-white">
                  <td class="border-r-1 border-white h-34px px-8px w-90px">操作</td>
                  <td class="border-r-1 border-white h-34px px-8px w-120px">消耗op</td>
                  <td class="border-r-1 border-white h-34px px-8px w-140px">消耗vp</td>
                </tr>
                <tr class="border-b-1 border-white">
                  <td class="border-r-1 border-white h-34px px-8px w-90px">发帖</td>
                  <td class="border-r-1 border-white h-34px px-8px w-120px">200</td>
                  <td class="border-r-1 border-white h-34px px-8px w-140px">0</td>
                </tr>
                <tr class="border-b-1 border-white">
                  <td class="border-r-1 border-white h-34px px-8px w-90px">点赞</td>
                  <td class="border-r-1 border-white h-34px px-8px w-120px">3</td>
                  <td class="border-r-1 border-white h-34px px-8px w-140px">3</td>
                </tr>
                <tr class="border-b-1 border-white">
                  <td class="border-r-1 border-white h-34px px-8px w-90px">转推</td>
                  <td class="border-r-1 border-white h-34px px-8px w-120px">15</td>
                  <td class="border-r-1 border-white h-34px px-8px w-140px">15</td>
                </tr>
                <tr class="border-b-1 border-white">
                  <td class="border-r-1 border-white h-34px px-8px w-90px">引用</td>
                  <td class="border-r-1 border-white h-34px px-8px w-120px">20</td>
                  <td class="border-r-1 border-white h-34px px-8px w-140px">0</td>
                </tr>
                <tr class="border-b-1 border-white">
                  <td class="border-r-1 border-white h-34px px-8px w-90px">回复</td>
                  <td class="border-r-1 border-white h-34px px-8px w-120px">5</td>
                  <td class="border-r-1 border-white h-34px px-8px w-140px">0</td>
                </tr>
                <tr class="border-b-1 border-white">
                  <td class="border-r-1 border-white h-34px px-8px w-90px">关注</td>
                  <td class="border-r-1 border-white h-34px px-8px w-120px">5</td>
                  <td class="border-r-1 border-white h-34px px-8px w-140px">0</td>
                </tr>
                <tr class="border-b-1 border-white">
                  <td class="border-r-1 border-white h-34px px-8px w-90px">打赏</td>
                  <td class="border-r-1 border-white h-34px px-8px w-120px">5</td>
                  <td class="border-r-1 border-white h-34px px-8px w-140px">0</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="bg-blockBg light:bg-white light:shadow-popper-tip rounded-12px py-1rem px-1.5rem mb-1rem">
          <div class="c-text-black text-18px 2md:text-20px">
            8、领取奖励会收取服务费吗？
          </div>
          <div class="text-14px leading-24px mt-1rem">
            从ver0.5.3开始，虫洞平台将从用户领取的奖励部分收取服务费。目前为从收取的奖励中的5%作为平台服务费，对应所有社区和所有的奖励。
            该方案为试运行中，为期3个月。
          </div>
        </div>
        <div class="bg-blockBg light:bg-white light:shadow-popper-tip rounded-12px py-1rem px-1.5rem mb-1rem">
          <div class="c-text-black text-18px 2md:text-20px">
            9、什么是邀请奖励？如何操作？
          </div>
          <div class="text-14px leading-24px mt-1rem">
            为鼓励更多用户加入到虫洞3平台来建设社区，2023年7月25日起，平台向邀请人和被邀请人双方提供邀请奖励。
            <ul class="list-disc pl-30px">
              <li class="mb-15px">
                被邀请人成功注册后，会享受到策展服务费（5%）8折优惠（即4%）
              </li>
              <li>
                邀请人会获取被邀请人在虫洞3平台每一笔策展服务费的一半（即获取2%）作为佣金。本活动暂定试运行3个月时间，3个月后根据各个社区的意见反馈进行调整。
              </li>
            </ul>
            <ul class="mt-15px">
              <li class="mb-15px">
                <div class="c-text-black">发起邀请：</div>
                <div>
                  进入“更多”>“推荐链接”，可以看到你的邀请链接和二维码，可以复制链接或二维码发给你的朋友。
                </div>
              </li>
              <li>
                <div class="c-text-black">查看邀请奖励：</div>
                <div>
                  进入“钱包”>”我的邀请激励“，可以看到每一笔邀请激励，连接钱包即可领取。
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div v-if="$i18n.locale==='en'">
        <div class="bg-blockBg light:bg-white light:shadow-popper-tip rounded-12px py-1rem px-1.5rem mb-1rem">
          <div class="c-text-black text-18px 2md:text-20px">
            1. What is Wormhole3?
          </div>
          <div class="text-14px leading-24px mt-1rem">
            Wormhole3 is a web3 application governed by decentralized code and protocol.
            It bridges the gap between the web2 and web3 worlds by quantifying community member’s contribution
            in curating content for the community, and therefore expanding the influence of Web3
            communities on social media platforms, and contributors are rewarded with cryptocurrency rewards.
            Web2 users can onboard Web3 easily and contribute to Web3 communities by "tweet to earn".
          </div>
        </div>
        <div class="bg-blockBg light:bg-white light:shadow-popper-tip rounded-12px py-1rem px-1.5rem mb-1rem overflow-hidden">
          <div class="c-text-black text-18px 2md:text-20px">
            2. How to participate in community content curation?
          </div>
          <div class="text-14px leading-24px mt-1rem">
            <ul class="list-disc pl-30px">
              <li class="mb-15px">
                <div class="c-text-black">Create Content: </div>
                <div>
                  On the Wormhole3 platform or directly on Twitter (once you’ve signed up on Wormhole3),
                  publish a tweet for your community and include the tweet-on-chain tag
                  <strong class="text-color62 c-text-black">#iweb3</strong>
                  and your community's unique tag (e.g., the tag for the Memeferc-20 community is
                  <strong  class="text-color62 c-text-black">#ferc</strong>).
                  By doing so, if other Wormhole3 users like or retweet your tweet, you can earn curation rewards.
                </div>
              </li>
              <li>
                <div class="c-text-black">Curate content: </div>
                <ul class="list-alpha pl-15px">
                  <li>
                    When you <strong class="text-colorA2">like</strong> and <strong class="text-colorA2">retweet</strong>
                    posts on Wormhole3 , it’s considered curating content,
                    and you can earn curator rewards. Take note that Twitter and Wormhole3 data is not 100% synced,
                    so you are advised to perform <strong class="text-colorA2">like</strong> and
                    <strong class="text-colorA2">retweet</strong> directly on Wormhole3 to ensure
                    that you’re eligible for curator rewards.
                  </li>
                  <li>
                    Please note that you can only curate tweet on Wormhole3.
                  </li>
                </ul>
                <div class="mt-15px">For instance: </div>
                <img src="~@/assets/faq-2.webp" alt="">
              </li>
            </ul>
          </div>

        </div>
        <div class="bg-blockBg light:bg-white light:shadow-popper-tip rounded-12px py-1rem px-1.5rem mb-1rem">
          <div class="c-text-black text-18px 2md:text-20px">
            3. How to view my rewards?
          </div>
          <div class="text-14px leading-24px mt-1rem">
            On the Wormhole3 platform, you can view your rewards by following these steps:
            <ul class="list-alpha pl-30px">
              <li>
                <div>Click on any tweet to see the breakdown of all curators and distributed rewards. </div>
                <img class="mb-15px" src="~@/assets/faq-3-1.webp" alt="">
              </li>
              <li>
                <div>In the "Profile" section, you can find all the tweets related to you.</div>
                <div>Please note that the final settlement of rewards will take place after 72 hours from
                  the tweet's initial publication, before then the displayed rewards are estimate only.
                  The final distribution might change depending on various factors, including the number of curators,
                  the Curation Credit of each curator and time of curation.
                </div>
                <img src="~@/assets/faq-3-2.webp" alt="">
              </li>
            </ul>
          </div>

        </div>
        <div class="bg-blockBg light:bg-white light:shadow-popper-tip rounded-12px py-1rem px-1.5rem mb-1rem">
          <div class="c-text-black text-18px 2md:text-20px">
            4. How to claim my rewards?
          </div>
          <div class="text-14px leading-24px mt-1rem">
            Under “Wallet” in the main navigation menu, you can find all settled rewards (72 hours after initial posting).
            Connect your evm-compatible wallet and switch between chains to claim the rewards
            you have on each chain. Take note that you need gas fees to claim rewards successfully.
          </div>
          <img src="~@/assets/faq-4.webp" alt="">
        </div>
        <div class="bg-blockBg light:bg-white light:shadow-popper-tip rounded-12px py-1rem px-1.5rem mb-1rem">
          <div class="c-text-black text-18px 2md:text-20px">
            5. Why is the data I see on Twitter different than those displayed on Wormhole3?
          </div>
          <div class="text-14px leading-24px mt-1rem">
            <div>
              Wormhole3 uses Twitter’s API to pull data, and currently we only pull “like” “reply”
              and “quote” data, while “retweet” data are not synced. <br>
              How to make sure my data is synced?
            </div>
            <ul class="list-alpha pl-30px">
              <li class="mb-5px">
                “Like” “retweet” and “quote” directly on Wormhole3 platform to ensure that you are eligible for curation rewards.
              </li>
              <li>
                If you choose to curate on Twitter, make sure you “quote” with #iweb3 and the community-specific tag for your action to be captured.
              </li>
            </ul>
          </div>
          <div class="w-full flex flex-col md:flex-row">
            <img class="w-full md:w-1/2" src="~@/assets/faq-5-1.webp" alt="">
            <img class="w-full md:w-1/2" src="~@/assets/faq-5-2.webp" alt="">
          </div>
        </div>
        <div class="bg-blockBg light:bg-white light:shadow-popper-tip rounded-12px py-1rem px-1.5rem mb-1rem">
          <div class="c-text-black text-18px 2md:text-20px">
            6. What is Curation Credit?
          </div>
          <div class="text-14px leading-24px mt-1rem">
            Curation Credit (CC) is a credit score given to each user for each community.
            It determines how much reward you get by creating and curating content in that community.
            Each community can customize its own CC settings. <br>
            Currently, <br>
            <strong class="text-colorFA">Social influence</strong> +
            <strong class="text-color19">Community Contribution</strong> = CC <br>
            <strong class="text-colorFA">Social influence</strong> is represented by Twitter Reputation NFT,
            we use a third party algorithm to evaluate how much influence your account has on Twitter.<br>
            <strong class="text-color19">Community Contribution</strong>
            is represented by economic contribution to the community,
            such as community token staking and LP staking operated on Nutbox. <br>
          </div>
          <img src="~@/assets/faq-6.webp" alt="">
        </div>
        <div class="bg-blockBg light:bg-white light:shadow-popper-tip rounded-12px py-1rem px-1.5rem mb-1rem">
          <div class="c-text-black text-18px 2md:text-20px">
            7. What is op, what is vp?
          </div>
          <div class="text-14px leading-24px mt-1rem">
            <ul class="list-disc pl-30px">
              <li class="mb-15px">
                <div class="c-text-black">Operation Power (OP): </div>
                <ul class="list-disc pl-15px">
                  <li>Any content-related operation consumes OP, this includes post, like, retweet, quote, reply, follow and tip. </li>
                  <li>Everyone has 2000 OP to begin with, and it takes 3 days to recover 100%.</li>
                  <li>If your OP is insufficient, your operations will not sync on-chain, and therefore you won't be eligible for creator and curator rewards.</li>
                  <li>OP does not affect your actions on Twitter.</li>
                </ul>
              </li>
              <li>
                <div class="c-text-black">Voting Power (VP): </div>
                <ul class="list-disc pl-15px">
                  <li>Any curation operation consumes OP, this includes like, retweet, quote. </li>
                  <li>Everyone has 200 VP to begin with, and it takes 3 days to recover 100%.</li>
                  <li>If your VP is insufficient, your curation won't take effect, and therefore you won't be eligible for curator rewards.</li>
                  <li>But take note VP does not affect your actions on Twitter.</li>
                </ul>
              </li>
            </ul>
            <div class="w-full overflow-auto no-scroll-bar opacity-70 xs:pl-30px mt-15px">
              <div class="mb-5px">Please see below table for detailed consumption rates.</div>
              <table>
                <tbody class="border-l-1 border-t-1 border-white">
                <tr class="border-b-1 border-white text-12px">
                  <td class="border-r-1 border-white h-34px px-8px w-90px">Operation</td>
                  <td class="border-r-1 border-white h-34px px-8px w-140px">OP consumption</td>
                  <td class="border-r-1 border-white h-34px px-8px w-140px">VP consumption</td>
                </tr>
                <tr class="border-b-1 border-white">
                  <td class="border-r-1 border-white h-34px px-8px w-90px">Post</td>
                  <td class="border-r-1 border-white h-34px px-8px w-120px">200</td>
                  <td class="border-r-1 border-white h-34px px-8px w-140px">0</td>
                </tr>
                <tr class="border-b-1 border-white">
                  <td class="border-r-1 border-white h-34px px-8px w-90px">Like</td>
                  <td class="border-r-1 border-white h-34px px-8px w-120px">3</td>
                  <td class="border-r-1 border-white h-34px px-8px w-140px">3</td>
                </tr>
                <tr class="border-b-1 border-white">
                  <td class="border-r-1 border-white h-34px px-8px w-90px">Retweet</td>
                  <td class="border-r-1 border-white h-34px px-8px w-120px">15</td>
                  <td class="border-r-1 border-white h-34px px-8px w-140px">15</td>
                </tr>
                <tr class="border-b-1 border-white">
                  <td class="border-r-1 border-white h-34px px-8px w-90px">Quote</td>
                  <td class="border-r-1 border-white h-34px px-8px w-120px">20</td>
                  <td class="border-r-1 border-white h-34px px-8px w-140px">0</td>
                </tr>
                <tr class="border-b-1 border-white">
                  <td class="border-r-1 border-white h-34px px-8px w-90px">Reply</td>
                  <td class="border-r-1 border-white h-34px px-8px w-120px">5</td>
                  <td class="border-r-1 border-white h-34px px-8px w-140px">0</td>
                </tr>
                <tr class="border-b-1 border-white">
                  <td class="border-r-1 border-white h-34px px-8px w-90px">Follow</td>
                  <td class="border-r-1 border-white h-34px px-8px w-120px">5</td>
                  <td class="border-r-1 border-white h-34px px-8px w-140px">0</td>
                </tr>
                <tr class="border-b-1 border-white">
                  <td class="border-r-1 border-white h-34px px-8px w-90px">Tip</td>
                  <td class="border-r-1 border-white h-34px px-8px w-120px">5</td>
                  <td class="border-r-1 border-white h-34px px-8px w-140px">0</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="bg-blockBg light:bg-white light:shadow-popper-tip rounded-12px py-1rem px-1.5rem mb-1rem">
          <div class="c-text-black text-18px 2md:text-20px">
            8. Is there collection of service fee ?
          </div>
          <div class="text-14px leading-24px mt-1rem">
            Since Ver0.5.3, Wormhole3 collects a service fee when users claim rewards. The current rate is 5% of rewards,
            for all communities and all reward claims on Wormhole3.
            This pilot scheme will run for 3 months as we assess feedback from the community.
          </div>
        </div>
        <div class="bg-blockBg light:bg-white light:shadow-popper-tip rounded-12px py-1rem px-1.5rem mb-1rem">
          <div class="c-text-black text-18px 2md:text-20px">
            9. What is the invitation scheme?
          </div>
          <div class="text-14px leading-24px mt-1rem">
            The invitation scheme aims to encourage more participants to join Wormhole3 and build the network.
            Since July 25th 2023, the platform provides benefits for both referrers and invitees.
            <ul class="list-disc pl-30px">
              <li class="">
                When invitee register with an invitation code, they are entitled to 20% discount to service fee (equivalent to 4% of service fee) for every claim.
              </li>
              <li>
                The referrer is entitled to receive half of the service fee (equivalent to 2% of service fee) collected for every claim made by their invitees.
              </li>
            </ul>
            This pilot scheme will run for 3 months as we assess feedback from the community.
            <ul class="mt-15px">
              <li class="mb-15px">
                <div class="c-text-black">How to invite:</div>
                <div>
                  Enter “More”>”Invitation”, you can find your invitation QR code, and you can copy your invitation link or QR code to your friend.
                </div>
              </li>
              <li>
                <div class="c-text-black">Where’s my inivitation rewards:</div>
                <div>
                  Enter “Wallet”>”My invitation reward”, you can see your unclaimed invitation reward and the details, switch blockchain and claim.
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LanguageChangeButtonVue from "@/components/LanguageChangeButton.vue";

export default {
  name: "FAQ",
  components: {
    LanguageChangeButtonVue,
  },
  data() {
    return {
      tabIndex: 0
    }
  }
}
</script>

<style scoped>

</style>
