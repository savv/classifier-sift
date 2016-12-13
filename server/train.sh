./fastText/fasttext supervised -input train.txt -output fastText/model
echo
echo
echo "Testing with 'how about coffee tomorrow at 5pm?'"
echo "how about coffee tomorrow at 5pm?" | ./fastText/fasttext predict-prob fastText/model.bin -
