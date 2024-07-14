import api from '@/utils/api';
import React, { useState, useEffect } from 'react';
import { Dimensions, RefreshControlProps } from 'react-native';
import { View, Text, FlatList, RefreshControl, useToken, useTheme, useColorMode } from '@gluestack-ui/themed';
import { useColorScheme } from 'react-native';


const MyRefreshControl = ({
	refreshing,
	onRefresh,
	...props
}: RefreshControlProps) => {
	const colorMode = useColorScheme();
	if (!colorMode) {
		return;
	}
	console.log(colorMode === "dark");

	return (colorMode === "dark") ?
		<RefreshControl backgroundColor='$amber300' progressBackgroundColor={useToken("colors", "backgroundDark700")} colors={["white"]}
			refreshing={refreshing} onRefresh={onRefresh}     {...props} />
		: <RefreshControl refreshing={refreshing} onRefresh={onRefresh}     {...props} />
};


export default function PropertiesLst() {
	const color = useColorScheme();
	const [data, setData] = useState([]);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const [refreshing, setRefreshing] = useState(false);

	useEffect(() => {
		fetchData();


	}, []);

	const fetchData = async (isRefresh = false) => {
		if (loading) return;

		setLoading(true);

		const currentPage = isRefresh ? 1 : page;

		try {
			const res = await api.get(`/api/properties?page=${currentPage}`);
			const result = res.data.properties;

			if (isRefresh) {
				setData(result);
			} else {
				setData(prevData => [...prevData, ...result]);
			}

			setPage(currentPage + 1);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	};

	const handleRefresh = () => {
		setRefreshing(true);
		fetchData(true);
	};

	const handleLoadMore = () => {
		fetchData();
	};



	const renderItem = ({ item }) => (
		<View style={{ padding: 20 }}>
			<Text>{item.title}</Text>
		</View>
	);

	const initialNumToRender = Math.ceil(Dimensions.get('window').height / 80);



	return <FlatList
			data={data}
			keyExtractor={(item, index) => index.toString()}
			renderItem={renderItem}
			onEndReached={handleLoadMore}
			onEndReachedThreshold={0}
			refreshControl={
				<RefreshControl progressBackgroundColor={color === "light" ? "white": "#525252" } colors={color ==="light"? ["black"]: ["white"]}    refreshing={refreshing} onRefresh={handleRefresh} />

			}
			refreshing={refreshing}
			onRefresh={handleRefresh}
			initialNumToRender={initialNumToRender}
			maxToRenderPerBatch={initialNumToRender + 10}
			windowSize={initialNumToRender + 21}
		/>;
};
//	<RefreshControl progressBackgroundColor={useToken("colors", "backgroundDark700")} colors={["white"]} refreshing={refreshing} onRefresh={handleRefresh} />