# 维诺 VULS

维诺要做的，是让高龄宠物的养护有据可查：先看清这只动物现在的状态，再用可核对的营养方案去照顾它，而不是用一次检测或一句延寿承诺代替兽医。

这个仓库目前只放数据标准，不放商城，也不放科研门户。VULS 用来描述一次观察从哪里来、如何测量、能否使用、后来有没有被更正。它不诊断疾病，不预测还能活多久，也不把犬、猫和人的同名指标当成可以直接比较的东西。

示例全部是虚构数据。这套草案还没有经过兽医审核。`reviewed` 只表示有人看过记录，不表示测量一定准确，更不表示研究结论成立。

## 现在已经有的

- 家犬的单次观察：体重、体况、进食量、活动时长、粪便性状。
- 同一只狗在一个研究里的多次观察，以及参加关系。
- 测量时间和录入时间分开；方法、设备、评估者和来源分开。
- 不合格记录会被拒绝，不完整的记录可以留下并标成警告或需要人工查看。
- 同一次观察的更正写成新版本，旧数值保留，撤销也不删除文件。
- 数据集清单锁定具体文件和版本。数据集版本和标准版本分开计算。

## 接下来做什么

先把质量报告按结构、测量、来源、审核、授权和版本链分开写清楚，不打一个总分。然后用一份许可允许再分发的外部小数据，试验这些字段能不能装下别人的记录，并写明对不上的地方。

文献目录、宠物健康寿命数据库和临床试验索引，要等这条链路稳定后再做。AI 问答和开放协作门户更晚。用户在产品里留下的档案不会自动变成可以公开的研究数据。

## 仓库里有什么

- `vinno-universal-data-standard`：字段、规则和虚构示例。
- `vinno-data-validator`：检查记录、修订链和数据集清单的参考实现。标准本身不依赖某一种编程语言。

## 运行测试

```bash
cd vinno-data-validator
python3 -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
pytest
```

检查一套纵向示例：

```bash
vuls validate-dataset \
  ../vinno-universal-data-standard/examples/datasets/synthetic-weight-follow-up \
  --schemas ../vinno-universal-data-standard/schemas/0.2 \
  --dictionaries ../vinno-universal-data-standard/dictionaries
```

校验一条单次观察：

```bash
vuls validate \
  ../vinno-universal-data-standard/examples/valid/canine-body-weight.json \
  --schema ../vinno-universal-data-standard/schemas/observation-record.schema.json \
  --dictionaries ../vinno-universal-data-standard/dictionaries
```
