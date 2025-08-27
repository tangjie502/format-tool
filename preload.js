// uTools 插件预加载脚本

// 动态添加HTML标签匹配功能
function setupDynamicFeatures() {
  try {
    console.log("开始设置动态功能...", typeof utools);
    
    if (typeof utools === 'undefined') {
      console.error("utools 对象未定义");
      return;
    }
    
    if (typeof utools.setFeature !== 'function') {
      console.error("utools.setFeature 方法不存在");
      return;
    }
    
    console.log("utools对象可用，开始添加动态功能");
    
    // 添加一个简单的测试命令
    const testResult = utools.setFeature({
      code: "html-test-simple",
      explain: "测试动态功能",
      cmds: ["动态测试", "测试html", "htmltest"]
    });
    console.log("测试功能添加结果:", testResult);
    
    // 添加HTML标签匹配
    const divResult = utools.setFeature({
      code: "html-div-matcher",
      explain: "HTML DIV标签格式化",
      cmds: ["<div"]
    });
    console.log("DIV匹配添加结果:", divResult);
    
    const buttonResult = utools.setFeature({
      code: "html-button-matcher", 
      explain: "HTML BUTTON标签格式化",
      cmds: ["<button"]
    });
    console.log("BUTTON匹配添加结果:", buttonResult);
    
    // 检查已添加的功能
    const allFeatures = utools.getFeatures();
    console.log("=== 所有功能列表 ===");
    console.log("总数:", allFeatures.length);
    allFeatures.forEach((f, index) => {
      console.log(`${index + 1}. ${f.code}: ${f.explain}`);
      console.log("   指令:", f.cmds);
    });
    
    console.log("动态功能设置完成");
    return true;
  } catch (error) {
    console.error("设置动态功能失败:", error);
    return false;
  }
}

// 等待插件完全加载后再设置
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM加载完成，尝试设置动态功能");
  setTimeout(setupDynamicFeatures, 1000);
});

// 监听插件进入事件，在这个时候也尝试设置
utools.onPluginEnter(() => {
  console.log("插件进入，检查动态功能");
  const features = utools.getFeatures();
  if (features.length <= 1) {
    console.log("动态功能未设置，重新尝试");
    setupDynamicFeatures();
  }
});

window.exports = {
  "html-formatter": {
    mode: "none",
    args: {
      enter: (action, callbackSetList) => {
        console.log("HTML 格式化工具已启动", action);
        if (action && action.payload) {
          // 自动填充到输入框
          setTimeout(() => {
            const inputHtml = document.getElementById('inputHtml');
            if (inputHtml) {
              inputHtml.value = action.payload;
              // 自动切换到输出标签页进行格式化
              const outputTab = document.querySelector('[data-tab="output"]');
              if (outputTab) {
                outputTab.click();
              }
            }
          }, 100);
        }
      },
    },
  },
  "html-test-simple": {
    mode: "none", 
    args: {
      enter: (action, callbackSetList) => {
        console.log("动态测试命令进入成功！", action);
        alert("🎉 动态指令测试成功！说明动态功能可以正常工作。");
        setTimeout(() => {
          const inputHtml = document.getElementById('inputHtml');
          if (inputHtml) {
            inputHtml.value = "<div class='test'>动态指令测试成功！</div>";
            const outputTab = document.querySelector('[data-tab="output"]');
            if (outputTab) {
              outputTab.click();
            }
          }
        }, 100);
      },
    },
  },
  "html-div-matcher": {
    mode: "none", 
    args: {
      enter: (action, callbackSetList) => {
        console.log("通过DIV标签匹配进入", action);
        // 这里不需要处理，因为onPluginEnter会统一处理
      },
    },
  },
  "html-button-matcher": {
    mode: "none", 
    args: {
      enter: (action, callbackSetList) => {
        console.log("通过BUTTON标签匹配进入", action);
        // 这里不需要处理，因为onPluginEnter会统一处理
      },
    },
  },
};

// 监听插件进入事件
utools.onPluginEnter(({ code, type, payload }) => {
  console.log("插件进入:", { code, type, payload });
  
  setTimeout(() => {
    const inputHtml = document.getElementById('inputHtml');
    const outputHtml = document.getElementById('outputHtml');
    
    if (inputHtml && outputHtml) {
      // 清空输出区域
      outputHtml.textContent = '';
      
      // 根据进入方式决定是否填充内容
      if (shouldAutoFillContent(code, type, payload)) {
        console.log("自动填充HTML内容:", payload);
        inputHtml.value = payload;
        // 自动切换到输出标签页进行格式化
        const outputTab = document.querySelector('[data-tab="output"]');
        if (outputTab) {
          outputTab.click();
        }
      } else {
        console.log("清空输入框，准备手动输入");
        inputHtml.value = '';
        // 确保在输入标签页
        const inputTab = document.querySelector('[data-tab="input"]');
        if (inputTab) {
          inputTab.click();
        }
      }
    }
  }, 100);
});

// 判断是否应该自动填充内容
function shouldAutoFillContent(code, type, payload) {
  // 如果没有payload，不填充
  if (!payload || payload.trim() === '') {
    return false;
  }
  
  // 如果payload就是搜索关键词本身，不填充
  const searchKeywords = [
    'html', 'htmltest', 'html美化', 'html格式化', 
    '代码格式化', '代码美化', 'format html', '美化代码',
    '格式化html', 'html代码美化', '动态测试', '测试html'
  ];
  
  if (searchKeywords.includes(payload.toLowerCase().trim())) {
    return false;
  }
  
  // 如果payload很短且不包含HTML标签，可能是搜索词，不填充
  if (payload.length < 10 && !payload.includes('<') && !payload.includes('>')) {
    return false;
  }
  
  // 如果包含HTML标签或者是长文本，则填充
  if (payload.includes('<') && payload.includes('>')) {
    return true;
  }
  
  // 如果是从特定的HTML匹配器进入，说明是HTML内容
  if (code && code.includes('html') && code.includes('matcher')) {
    return true;
  }
  
  // 默认不填充，让用户手动输入
  return false;
}

// 监听插件退出事件
utools.onPluginOut(() => {
  console.log("插件退出");
});

// 添加快捷键支持清空
document.addEventListener('keydown', (e) => {
  // Ctrl+L 或 Cmd+L 清空输入
  if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
    e.preventDefault();
    const inputHtml = document.getElementById('inputHtml');
    const outputHtml = document.getElementById('outputHtml');
    if (inputHtml && outputHtml) {
      inputHtml.value = '';
      outputHtml.textContent = '';
      // 切换到输入标签页
      const inputTab = document.querySelector('[data-tab="input"]');
      if (inputTab) {
        inputTab.click();
      }
      console.log("快捷键清空完成");
    }
  }
});
