<style lang="stylus" scoped>
.news-info {
  position: relative;
  padding-bottom: .36rem;
  & > h1 {
    font-size: .18rem;
    color: #222;
    line-height: .22rem;
    word-break: break-all;
  }
  & > .author {
    position: absolute;
    bottom: 0;
    color: #999;
    font-size: .12rem;
    line-height: 1em;
  }
  & > .collectBtn {
    position: absolute;
    bottom: 0;
    font-size: .13rem;
    right: 0;
    display: inline-block;
    padding: 0 .08rem;
    height: .23rem;
    line-height: .23rem;
    text-align: center;
    color: #2cbcff;
    border-radius: .02rem;
    border: solid 1px #2cbcff;
    transition: background-color .2s ease, color .2s ease;
    &.collected {
      background-color: #2cbcff;
      color: #fff;
    }
    &.disabled {
      border-color: #bbb;
      color: #999;
      background-color: #fff;
    }
  }
}
/* 商家信息 */
.shop-info {
  padding-top: .3rem;
}
/* 相关阅读 */
.related {
  margin-top: .3rem;
  & > h4 {
    color: #2dbcff;
    font-size: .14rem;
    padding-bottom: .1rem;
  }
  & > ul {
    & > li {
      line-height: .22rem;
      position: relative;
      padding: .02rem 0 .02rem .12rem;
      & > a {
        color: #222;
        font-size: .14rem;
      }
      &:before {
        background-color: #222;
        width: .03rem;
        height: .03rem;
        display: block;
        content: '';
        border-radius: 50%;
        position: absolute;
        left: 0;
        top: .125rem;
      }
    }
  }
}
/* 文章分享 */
.share-link {
  & > a {
    width: .3rem;
    height: .3rem;
    display: inline-block;
    float: left;
    margin-right: .2rem;
    position: relative;
    border-radius: .02rem;
    &:last-of-type {
      margin-right: 0;
    }
    &.weibo {
      background-color: #ffa740;
      &:after {
        font-size: .2rem;
      }
    }
    &.qq {
      background-color: #4e9ac8;
      &:after {
        font-size: .18rem;
      }
    }
    &:after {
      color: #fff;
      position: absolute;
      left: 50%;
      top: 50%;
      line-height: 1em;
      transform: translate(-50%, -50%);
    }
  }
}
</style>

<template>
  <layout>
    <layout-header :title="lang.title"></layout-header>
    <layout-body>
      <div class="news-detail ui-card ui-card-padd">
        <div class="news-info">
          <h1 class="t-bold">{{newsTitle}}</h1>
          <span class="author">{{newsAuthor}}  {{newsDate}}</span>
          <a v-if="newsCollected && collectStatus === -1" class="collectBtn collected" @click="collectNews(0)">{{lang.collected}}</a>
          <a v-if="newsCollected && collectStatus === 0" class="collectBtn disabled">{{lang.collectCanceling}}</a>
          <a v-if="!newsCollected && collectStatus === -1" class="collectBtn" @click="collectNews(1)">{{lang.collect}}</a>
          <a v-if="!newsCollected && collectStatus === 1" class="collectBtn disabled">{{lang.collecting}}</a>
        </div>
        <div class="shop-info" v-if="shopName">
          <id-card :shopId="shopId" :shopName="shopName" :shopLogo="shopLogo" :shopDesc="shopDesc" :shopAuth="shopAuth"></id-card>
        </div>
        <article class="html-content" v-html="htmlpx2rem(newsContent)"></article>
        <div class="related">
          <h4 class="t-bold">{{lang.relatedRead}}</h4>
          <ul>
            <li v-for="item in readList">
              <router-link :to="{name: 'news:detail', params: {news_id: item.news_id}}">{{item.news_title}}</router-link>
            </li>
          </ul>
        </div>
      </div>
      <div class="share-link ui-card ui-card-padd ui-card-overline ui-card-underline ui-card-mar-btm clearfix">
        <a class="weibo iconfont i-weibo-aft" @click="WeiboShare"></a>
        <a class="qq iconfont i-qq-aft" @click="QQShare"></a>
      </div>
      <div class="clearfix"></div>
    </layout-body>
  </layout>
</template>

<script>
import {Layout, LayoutHeader, LayoutBody} from '../layout';
import IdCard from '../shop/components/IdCard.vue';

import Helper from 'helper';
import {CHANNEL_CODE, USER_AUTH} from 'config';
import {Http, translate} from 'methods';

const language = translate({
  'zh-cn': {
    title: '资讯详情',
    collect: '收藏',
    collected: '已收藏',
    relatedRead: '相关阅读',
    collectCanceling: '正在取消…',
    collecting: '收藏中…',
    collectResult: ['取消收藏成功！', '攻略收藏成功！']
  },
  'zh-tw': {
    title: '資訊詳情',
    collect: '收藏',
    collected: '已收藏',
    relatedRead: '相關閱讀',
    collectCanceling: '正在取消…',
    collecting: '收藏中…',
    collectResult: ['取消收藏成功！', '攻略收藏成功！']
  }
});

export default {
  components: {
    Layout,
    LayoutHeader,
    LayoutBody,
    IdCard
  },
  data() {
    return {
      newsId: '',
      newsTitle: '',
      newsLogo: '',
      newsAuthor: '',
      newsDate: '',
      newsContent: '',
      newsCollected: false,
      collectStatus: -1,
      readList: [],
      shopId: 0,
      shopName: '',
      shopDesc: '',
      shopLogo: '',
      shopAuth: false,
      lang: language
    };
  },
  beforeRouteEnter(to, from, next) {
    Http.fetch('news/get_news_detail', {
      news_id: to.params.news_id
    }).then(response => {
      Http.resolve(response).then(result => {
        next(vm => {
          vm.$set(vm, 'newsId', result.data.news_id);
          vm.$set(vm, 'newsTitle', result.data.news_title);
          vm.$set(vm, 'newsLogo', result.data.news_small_img);
          vm.$set(vm, 'newsAuthor', result.data.news_author);
          vm.$set(vm, 'newsDate', result.data.news_create_date);
          vm.$set(vm, 'newsContent', result.data.news_content);
          vm.$set(vm, 'newsCollected', !!result.data.collect_flag);
          vm.$set(vm, 'readList', result.data.rela_read_list);

          vm.$set(vm, 'shopId', result.data.shop_id);
          vm.$set(vm, 'shopName', result.data.shop_name);
          vm.$set(vm, 'shopDesc', result.data.shop_desc);
          vm.$set(vm, 'shopLogo', result.data.shop_logo_url);
          vm.$set(vm, 'shopAuth', result.data.shop_auth);
        });
      }).catch(error => {
        next({path: '/404'});
        throw new Error(error);
      });
    });
  },
  watch: {
    $route(to, from) {
      Http.fetch('news/get_news_detail', {
        news_id: to.params.news_id
      }).then(response => {
        Http.resolve(response).then(result => {
          this.$set(this, 'newsId', result.data.news_id);
          this.$set(this, 'newsTitle', result.data.news_title);
          this.$set(this, 'newsLogo', result.data.news_small_img);
          this.$set(this, 'newsAuthor', result.data.news_author);
          this.$set(this, 'newsDate', result.data.news_create_date);
          this.$set(this, 'newsContent', result.data.news_content);
          this.$set(this, 'newsCollected', !!result.data.collect_flag);
          this.$set(this, 'readList', result.data.rela_read_list);

          this.$set(this, 'shopId', result.data.shop_id);
          this.$set(this, 'shopName', result.data.shop_name);
          this.$set(this, 'shopDesc', result.data.shop_desc);
          this.$set(this, 'shopLogo', result.data.shop_logo_url);
          this.$set(this, 'shopAuth', result.data.shop_auth);
        }).catch(error => {
          this.$router.replace({path: '/404'});
          throw new Error(error);
        });
      });
    }
  },
  methods: {
    htmlpx2rem(value) {
      return Helper.htmlpx2rem(value);
    },
    getShareParams(params) {
      const url = window.location.href;
      const title = this.newsTitle;
      const config = {url, title, ...params};
      const data = [];

      for (let key in config) {
        data.push(key + '=' + encodeURIComponent(config[key] || ''));
      };

      return data.join('&');
    },
    QQShare() {
      window.location.href = 'http://connect.qq.com/widget/shareqq/index.html?' + this.getShareParams({pics: this.newsLogo});
    },
    WeiboShare() {
      window.location.href = 'http://v.t.sina.com.cn/share/share.php?' + this.getShareParams({appkey: 433903842});
    },
    collectNews(status) {
      this.collectStatus = status;

      if (USER_AUTH.user_auth === false) {
        this.userSignIn(status);
      } else {
        Http.fetch('api/save_attend', {
          thing_id: this.newsId,
          type: 8,
          status,
          url: encodeURIComponent(window.location.href)
        }, CHANNEL_CODE).then(response => {
          this.collectStatus = -1;

          Http.resolve(response).then(result => {
            if (result.status === 1) {
              this.newsCollected = !this.newsCollected;
              this.$message(language.collectResult[status]);
            } else if (result.status === -2) {
              this.userSignIn(status);
            };
          }).catch(error => {
            if (response.ok) this.$message(error);
            throw new Error(error);
          });
        });
      };
    },
    userSignIn(status) {
      this.$login({
        container: this.$el,
        onShow: () => {
          this.$root.$emit('blur:toggle');
        },
        onSuccess: () => {
          this.collectNews(status);
        },
        onForgone: () => {
          this.collectStatus = -1;
        },
        onHide: () => {
          this.$root.$emit('blur:toggle');
        }
      });
    }
  }
};
</script>
