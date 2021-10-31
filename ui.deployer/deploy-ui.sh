ui_deployer=triporder_ui_deployer
html_repo_host=triporder_html_repo_host

tempdir=$(tempfile)
rm -rf $tempdir
mkdir $tempdir

pushd $(dirname $0)/resources
#for f in $(ls *.zip);do unzip "$f" -d "$tempdir/${f%.*}" ; done
for f in $(ls *.zip);do
    unzip "$(find ../../app -name $f)" -d "$tempdir/${f%.*}" ; 
done

popd

pushd $tempdir
cf html5-push -n ${html_repo_host}
popd 

rm -rf $tempdir

echo "Applications deployed to ${html_repo_host} are:"
cf html5-list | grep ${html_repo_host}