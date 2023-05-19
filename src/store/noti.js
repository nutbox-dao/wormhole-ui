// noti type: 1.quote，2.retweet，3.reply，4，like，5。follow，10，tip，20.system

export default {
    namespaced: true,
    state: {
      newNotis: [],
      postNotis: [],
      tipNotis: [],
      sysNotis: []
    },
    mutations: {
      saveNewNotis: (state, newNotis) => {
        state.newNotis = newNotis;
      },
      savePostNotis: (state, postNotis) => {
        state.postNotis = postNotis
      },
      savetTipNotis: (state, tipNotis) => {
        state.tipNotis =tipNotis
      },
      savetSysNotis: (state, sysNotis) => {
        state.sysNotis =sysNotis
      },
      
      readAll: (state) => {
        state.newNotis = [];
        state.postNotis = state.postNotis.map(n => n.isRead = 1);
        state.tipNotis = state.postNotis.map(n => n.isRead = 1);
        state.sysNotis = state.postNotis.map(n => n.isRead = 1);
      }
    }
  };
  