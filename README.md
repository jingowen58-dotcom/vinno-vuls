# 维诺 VULS 0.1

这里是两件能运行的东西：

- `vinno-universal-data-standard`：家犬观察记录的草案。0.1 是单次观察，0.2 能把同一只狗在一个研究里的多次观察连起来。
- `vinno-data-validator`：检查单条记录，以及一套 0.2 数据里的编号是否对得上。

这些草案不诊断、不预测寿命、不比较不同物种的同名指标。示例数据是虚构的，还没有经过兽医审核。论文库和科研门户没有开始做。

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

校验一条 0.1 示例：

```bash
vuls validate \
  ../vinno-universal-data-standard/examples/valid/canine-body-weight.json \
  --schema ../vinno-universal-data-standard/schemas/observation-record.schema.json \
  --dictionaries ../vinno-universal-data-standard/dictionaries
```
