<style scoped>
  .news-info{position:relative;padding-bottom:.36rem;}
  .news-info>h1{font-size:.18rem;color:#222;line-height:.22rem;}
  .news-info>.author{position:absolute;bottom:0;color:#999;font-size:.12rem;line-height:1em;}
  .news-info>.collectBtn{position:absolute;bottom:0;font-size:.13rem;right:0;display:inline-block;padding:0 .08rem;height:.23rem;line-height:.23rem;text-align:center;color:#2cbcff;border-radius:.02rem;border:solid 1px #2cbcff;transition:background-color .2s ease, color .2s ease;}
  .news-info>.collectBtn.collected{background-color:#2cbcff;color:#fff;}
  .news-info>.collectBtn.disabled{border-color:#bbb;color:#999;background-color:#fff;}

  /* 商家信息 */
  .shop-info{padding-top:.3rem;}

  /* 文章内容 */
  .news-content{font-size:.14rem;color:#333;line-height:1.8em;word-break:break-word;padding-top:.3rem;user-select:text;}

  /* 相关阅读 */
  .related{margin-top:.3rem;}
  .related>h4{color:#2dbcff;font-size:.14rem;padding-bottom:.1rem;}
  .related>ul>li{line-height:.22rem;position:relative;padding:.02rem 0 .02rem .12rem;}
  .related>ul>li>a{color:#222;font-size:.14rem;}
  .related>ul>li:before{background-color:#222;width:.03rem;height:.03rem;display:block;content:'';border-radius:50%;position:absolute;left:0;top:.125rem;}

  /* 文章分享 */
  .share-link>a{width:.3rem;height:.3rem;display:inline-block;float:left;margin-right:.2rem;position:relative;border-radius:.02rem;}
  .share-link>a:last-of-type{margin-right:0;}
  .share-link>a.weibo{background-color:#ffa740;}
  .share-link>a.qq{background-color:#4e9ac8;}
  .share-link>a:after{color:#fff;position:absolute;left:50%;top:50%;line-height:1em;
    transform:translate(-50%, -50%);
  }
  .share-link>a.weibo:after{font-size:.2rem;}
  .share-link>a.qq:after{font-size:.18rem;}
</style>
<style>
  .news-content a{text-decoration:underline;color:#2cbcff;}
  .news-content img{max-width:100%;}
  .news-content table{width:100%;border-collapse:collapse;border:solid 1px #f0f0f0;margin:.1rem 0;}
  .news-content table td{border:solid 1px #f0f0f0;padding:.06rem;}
</style>

<template>
  <wrapper>
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
      <article class="news-content" v-html="htmlpx2rem(newsContent)"></article>
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
  </wrapper>
</template>

<script>
import Wrapper from 'components/layout/Wrapper.vue';
import IdCard from '../shop/components/IdCard.vue';

import Helper from 'helper';
import {Http, LANG_TYPE, CHANNEL_CODE} from 'config';

const Language = {
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
};
const language = Language[LANG_TYPE];

export default {
  components: {
    Wrapper,
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
  created: function() {
    this.fetchData(this.$route.params.news_id);
  },
  mounted: function() {
    this.$root.$emit('app:update', {
      title: language.title,
      item: ['back']
    });
  },
  watch: {
    $route: function(to, from) {
      this.fetchData(to.params.news_id);
    }
  },
  methods: {
    fetchData: function(newsId) {
      Http.fetch('news/get_news_detail', {
        news_id: newsId
      }).then(response => {
        if (response.ok) {
          response.json().then(result => {
            if (result.status === 0) return;

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
          });
        };
      });
    },
    htmlpx2rem: function(value) {
      return Helper.htmlpx2rem(value);
    },
    getShareParams: function(params) {
      const url = window.location.href;
      const title = this.newsTitle;
      const config = {url, title, ...params};
      const data = [];

      for (let key in config) {
        data.push(key + '=' + encodeURIComponent(config[key] || ''));
      };

      return data.join('&');
    },
    QQShare: function() {
      window.location.href = 'http://connect.qq.com/widget/shareqq/index.html?' + this.getShareParams({pics: this.newsLogo});
    },
    WeiboShare: function() {
      window.location.href = 'http://v.t.sina.com.cn/share/share.php?' + this.getShareParams({appkey: 433903842});
    },
    collectNews: function(status) {
      this.collectStatus = status;

      Http.fetch('api/save_attend', {
        thing_id: this.newsId,
        type: 8,
        status,
        url: encodeURIComponent(window.location.href)
      }, CHANNEL_CODE).then(response => {
        this.collectStatus = -1;

        if (response.ok) {
          response.json().then(result => {
            if (result.status === 0) {
              this.$message(result.msg);
            } else if (result.status === -2) {
              this.$login(() => {
                this.collectNews(status);
              });
            } else if (result.status === 1) {
              this.newsCollected = !this.newsCollected;
              this.$message(language.collectResult[status]);
            };
          });
        };
      });
    }
  }
};
</script>
