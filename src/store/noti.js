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
        state.postNotis = postNotis ?? []
      },
      saveTipNotis: (state, tipNotis) => {
        state.tipNotis = tipNotis ?? []
      },
      saveSysNotis: (state, sysNotis) => {
        state.sysNotis =sysNotis ?? []
      },
      
      readAll: (state) => {
        state.newNotis = [];
        try {
          state.postNotis.forEach(n => n.isRead = 1);
          state.tipNotis.forEach(n => n.isRead = 1);
          state.sysNotis.forEach(n => n.isRead = 1);
        }catch(e) {
          console.log("Read all fail:", e)
        }
      }
    }
  };
  